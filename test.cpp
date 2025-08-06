//+------------------------------------------------------------------+
//|                    NLLS_Trend.mq5                                |
//|                        Copyright 2025, Gabrielius Pocevicius     |
//|                                       https://www.mql5.com       |
//+------------------------------------------------------------------+
#property copyright "Copyright 2025, Gabrielius Pocevicius"
#property link      "https://www.mql5.com"
#property version   "1.20" // Version updated for refactoring
#property description "Non-Linear Least Squares Trend Detection Indicator"
#property description "Advanced trend analysis using NLLS regression with volatility adjustment"
#property description "Features adaptive trend lines, decile mean smoothing, and robust validation"

#property indicator_chart_window
#property indicator_buffers 7
#property indicator_plots   3

// High NLLS (Bear trend indicator)
#property indicator_label1  "High_NLLS"
#property indicator_type1   DRAW_COLOR_LINE
#property indicator_color1  clrRed, CLR_NONE
#property indicator_style1  STYLE_SOLID
#property indicator_width1  3 

// Low NLLS (Bull trend indicator)
#property indicator_label2  "Low_NLLS"
#property indicator_type2   DRAW_COLOR_LINE
#property indicator_color2  clrBlue, CLR_NONE
#property indicator_style2  STYLE_SOLID
#property indicator_width2  3

// Adaptive price line
#property indicator_label3  "Adaptive_Line"
#property indicator_type3   DRAW_COLOR_LINE
#property indicator_color3  clrRed, clrBlue, clrYellow
#property indicator_style3  STYLE_SOLID
#property indicator_width3  3

//--- Input parameters
input int    PeriodNLLS       = 21;        // NLLS Period
input int    SmoothingPeriod  = 1;         // Smoothing Period (1 = no smoothing)
input double SlopeThreshold   = 0.00001;   // Minimum slope change
input int    ConfirmBars      = 5;         // Bars to confirm trend change (1-5)
input int    MAShift          = 0;         // Shift
input bool   UseDecileMean    = true;      // Use Decile Mean for robust averaging

// NLLS specific parameters (from NonLinearLeastSquares)
input int    InpMaxIterations = 8;         // Maximum iterations for convergence
input double InpTolerance = 0.000001;      // Convergence tolerance
input bool   InpVolatilityAdjust = true;   // Adjust for volatility
input double InpVolatilityFactor = 0.3;    // Volatility adjustment factor
input double InpSmoothingFactor = 0.2;     // Smoothing factor to prevent jumps

//--- Buffer indices
double HighNLLSBuffer[];
double HighNLLSColors[];
double LowNLLSBuffer[];
double LowNLLSColors[];
double AdaptiveLineBuffer[];
double AdaptiveLineColors[];
double TrendBuffer[];

//--- Constants
#define NLLS_ACTIVE     0
#define NLLS_INACTIVE   1
#define BULL_TREND      0
#define BEAR_TREND      1
#define ADAPTIVE_RED    0
#define ADAPTIVE_BLUE   1
#define ADAPTIVE_YELLOW 2

//+------------------------------------------------------------------+
//| Structure to hold state and data for one NLLS channel            |
//+------------------------------------------------------------------+
struct NLLSChannelData
{
    // Buffers for calculation
    double m_x_values[PeriodNLLS];
    double m_y_values[PeriodNLLS];
    double m_weights[PeriodNLLS];
    
    // State variables
    double m_price_scale;
    double m_previous_value;
    double m_previous_valid_value;

    // Constructor to initialize state
    NLLSChannelData() : m_price_scale(0.0), m_previous_value(0.0), m_previous_valid_value(0.0) {}
};


//--- Global variables for NLLS calculation
int minBarsRequired;
NLLSChannelData m_high_channel; // Refactored state for High channel
NLLSChannelData m_low_channel;  // Refactored state for Low channel
double m_volatility_buffer[];

//+------------------------------------------------------------------+
//| Calculate Decile Mean for robust central tendency               |
//+------------------------------------------------------------------+
double CalculateDecileMean(double &data[], int start_idx = 0, int count = -1)
{
    int data_size = ArraySize(data);
    if(count < 0) count = data_size - start_idx;
    if(count < 10) return CalculateSimpleMean(data, start_idx, count); // Need at least 10 points for deciles
    
    // Create working array
    double sorted_data[];
    ArrayResize(sorted_data, count);
    
    // Copy data to working array
    for(int i = 0; i < count; i++)
    {
        if(start_idx + i < data_size)
            sorted_data[i] = data[start_idx + i];
        else
            sorted_data[i] = 0.0;
    }
    
    // Sort the data
    ArraySort(sorted_data);
    
    // Calculate deciles (D1 to D9)
    double decile_sum = 0.0;
    for(int i = 1; i <= 9; i++)
    {
        int decile_index = (int)MathFloor((double)i * count / 10.0);
        if(decile_index >= count) decile_index = count - 1;
        if(decile_index < 0) decile_index = 0;
        
        decile_sum += sorted_data[decile_index];
    }
    
    return decile_sum / 9.0; // Average of the 9 deciles
}

//+------------------------------------------------------------------+
//| Calculate Simple Mean (fallback)                                |
//+------------------------------------------------------------------+
double CalculateSimpleMean(double &data[], int start_idx = 0, int count = -1)
{
    int data_size = ArraySize(data);
    if(count < 0) count = data_size - start_idx;
    if(count <= 0) return 0.0;
    
    double sum = 0.0;
    int valid_count = 0;
    
    for(int i = 0; i < count; i++)
    {
        if(start_idx + i < data_size)
        {
            sum += data[start_idx + i];
            valid_count++;
        }
    }
    
    return (valid_count > 0) ? sum / valid_count : 0.0;
}

//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int OnInit()
{
    if (!ValidateInputParameters())
        return INIT_PARAMETERS_INCORRECT;
    
    minBarsRequired = PeriodNLLS + SmoothingPeriod + ConfirmBars;
    
    if (!InitializeBuffers())
        return INIT_FAILED;
    
    InitializeNLLSArrays();
    ConfigurePlotSettings();
    SetIndicatorProperties();
    
    return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Validate input parameters                                        |
//+------------------------------------------------------------------+
bool ValidateInputParameters()
{
    if (PeriodNLLS < 1)
    {
        Print("Error: NLLS period must be greater than 0");
        return false;
    }
    
    if (SmoothingPeriod < 1)
    {
        Print("Error: Smoothing period must be greater than 0");
        return false;
    }
    
    if (ConfirmBars < 1 || ConfirmBars > 5)
    {
        Print("Error: Confirm bars must be between 1 and 5");
        return false;
    }
    
    return true;
}

//+------------------------------------------------------------------+
//| Initialize indicator buffers                                     |
//+------------------------------------------------------------------+
bool InitializeBuffers()
{
    SetIndexBuffer(0, HighNLLSBuffer, INDICATOR_DATA);
    SetIndexBuffer(1, HighNLLSColors, INDICATOR_COLOR_INDEX);
    SetIndexBuffer(2, LowNLLSBuffer, INDICATOR_DATA);
    SetIndexBuffer(3, LowNLLSColors, INDICATOR_COLOR_INDEX);
    SetIndexBuffer(4, AdaptiveLineBuffer, INDICATOR_DATA);
    SetIndexBuffer(5, AdaptiveLineColors, INDICATOR_COLOR_INDEX);
    SetIndexBuffer(6, TrendBuffer, INDICATOR_CALCULATIONS);
    
    // Set arrays as time-descending
    ArraySetAsSeries(HighNLLSBuffer, true);
    ArraySetAsSeries(HighNLLSColors, true);
    ArraySetAsSeries(LowNLLSBuffer, true);
    ArraySetAsSeries(LowNLLSColors, true);
    ArraySetAsSeries(AdaptiveLineBuffer, true);
    ArraySetAsSeries(AdaptiveLineColors, true);
    ArraySetAsSeries(TrendBuffer, true);
    
    return true;
}

//+------------------------------------------------------------------+
//| Initialize NLLS arrays                                           |
//+------------------------------------------------------------------+
void InitializeNLLSArrays()
{
    // The NLLSChannelData struct now handles most of this implicitly.
    // We just need to resize the volatility buffer.
    ArrayResize(m_volatility_buffer, PeriodNLLS * 2);
    
    // Initialization of state variables is handled by the NLLSChannelData constructor.
}

//+------------------------------------------------------------------+
//| Configure plot settings                                          |
//+------------------------------------------------------------------+
void ConfigurePlotSettings()
{
    for (int i = 0; i < 3; i++)
        PlotIndexSetInteger(i, PLOT_DRAW_BEGIN, minBarsRequired);
    
    PlotIndexSetInteger(0, PLOT_SHIFT, MAShift);
    PlotIndexSetInteger(1, PLOT_SHIFT, MAShift);
    
    for (int i = 0; i < 3; i++)
        PlotIndexSetDouble(i, PLOT_EMPTY_VALUE, 0.0);
}

//+------------------------------------------------------------------+
//| Set indicator properties                                         |
//+------------------------------------------------------------------+
void SetIndicatorProperties()
{
    IndicatorSetInteger(INDICATOR_DIGITS, _Digits + 1);
    string decile_str = UseDecileMean ? " DM" : "";
    IndicatorSetString(INDICATOR_SHORTNAME, 
                      "NLLS Trend (" + string(PeriodNLLS) + ") Smooth:" + string(SmoothingPeriod) + decile_str);
}

//+------------------------------------------------------------------+
//| Apply smoothing to buffer                                        |
//+------------------------------------------------------------------+
void ApplySmoothing(double &source[], double &target[], int rates_total, int start_pos)
{
    if (SmoothingPeriod <= 1)
    {
        for (int i = start_pos; i >= 0; i--)
            target[i] = source[i];
        return;
    }
    
    for (int i = start_pos; i >= 0; i--)
    {
        if (i + SmoothingPeriod > rates_total)
        {
            target[i] = source[i];
            continue;
        }
        
        if(UseDecileMean && SmoothingPeriod >= 10)
        {
            // Use decile mean for robust smoothing
            double temp_array[];
            ArrayResize(temp_array, SmoothingPeriod);
            int valid_count = 0;
            
            for (int j = 0; j < SmoothingPeriod; j++)
            {
                if (source[i + j] != 0.0)
                {
                    temp_array[valid_count] = source[i + j];
                    valid_count++;
                }
            }
            
            if(valid_count >= 10)
            {
                ArrayResize(temp_array, valid_count);
                target[i] = CalculateDecileMean(temp_array);
            }
            else if(valid_count > 0)
            {
                target[i] = CalculateSimpleMean(temp_array, 0, valid_count);
            }
            else
            {
                target[i] = source[i];
            }
        }
        else
        {
            // Use simple averaging
            double sum = 0.0;
            int valid_count = 0;
            for (int j = 0; j < SmoothingPeriod; j++)
            {
                if (source[i + j] != 0.0) // Only include non-zero values
                {
                    sum += source[i + j];
                    valid_count++;
                }
            }
            
            if (valid_count > 0)
                target[i] = sum / valid_count;
            else
                target[i] = source[i];
        }
    }
}

//+------------------------------------------------------------------+
//| Calculate a generic NLLS value for a given price series          |
//| This function replaces the original duplicated functions         |
//+------------------------------------------------------------------+
double CalculateNLLS(const double &prices[], int current_index, NLLSChannelData &channel)
{
    // --- 1. Data Preparation ---
    // Prepare Y values. X values are always 0..PeriodNLLS-1.
    for(int j = 0; j < PeriodNLLS; j++)
    {
        channel.m_x_values[j] = j;
        channel.m_y_values[j] = prices[current_index + PeriodNLLS - 1 - j];
    }
    
    // --- 2. Calculate Mean ---
    // Price mean is always needed for scaling, bounds, or fallback.
    const double price_mean = UseDecileMean ? 
                              CalculateDecileMean(channel.m_y_values) : 
                              CalculateSimpleMean(channel.m_y_values);

    // --- 3. Set Weights ---
    if(InpVolatilityAdjust)
    {
        const double volatility = CalculateVolatility(prices, current_index);
        channel.m_price_scale = price_mean; // Set price scale for this channel
        CalculateVolatilityWeights(channel.m_y_values, channel.m_weights, volatility, channel.m_price_scale);
    }
    else
    {
        // Equal weights if not using volatility adjustment
        for(int j = 0; j < PeriodNLLS; j++)
            channel.m_weights[j] = 1.0;
    }
    
    // --- 4. Calculate NLLS Fit ---
    double raw_value = CalculateNonLinearLS(channel.m_x_values, channel.m_y_values, channel.m_weights, price_mean);
    
    // --- 5. Enhanced Validation and Smoothing ---
    if(!MathIsValidNumber(raw_value) || raw_value <= 0.0)
    {
        // Fallback to the last known good value, or the price mean if none exists
        raw_value = (channel.m_previous_valid_value > 0.0) ? channel.m_previous_valid_value : price_mean;
    }
    else
    {
        // --- 5a. Apply Bounds Checking ---
        double min_price = channel.m_y_values[0], max_price = channel.m_y_values[0];
        for(int j = 1; j < PeriodNLLS; j++)
        {
            if(channel.m_y_values[j] < min_price) min_price = channel.m_y_values[j];
            if(channel.m_y_values[j] > max_price) max_price = channel.m_y_values[j];
        }
        
        const double price_range = max_price - min_price;
        const double lower_bound = min_price - price_range * 0.5; // Allow 50% excursion below range
        const double upper_bound = max_price + price_range * 0.5; // Allow 50% excursion above range
        
        // Clamp the value to reasonable bounds
        raw_value = MathMax(lower_bound, MathMin(upper_bound, raw_value));
        
        // --- 5b. Apply Smoothing to Prevent Jumps ---
        if(current_index > 0 && channel.m_previous_value != 0.0)
        {
            // Define a max allowed change per bar to prevent erratic jumps
            const double max_change = MathMax(price_range * 0.1, price_mean * 0.01); // 10% of range or 1% of mean
            double change = raw_value - channel.m_previous_value;
            
            // Limit the rate of change
            if(MathAbs(change) > max_change)
            {
                raw_value = channel.m_previous_value + ( (change > 0) ? max_change : -max_change );
            }
            
            // Apply final EMA-style smoothing
            raw_value = channel.m_previous_value + InpSmoothingFactor * (raw_value - channel.m_previous_value);
        }
        
        channel.m_previous_valid_value = raw_value; // Store the last good calculated value
    }
    
    // Update the previous value state for the next iteration's smoothing
    channel.m_previous_value = raw_value;
    return raw_value;
}

//+------------------------------------------------------------------+
//| Calculate NLLS value for High prices (wrapper function)          |
//+------------------------------------------------------------------+
double CalculateNLLSHigh(const double &high[], int current_index)
{
    return CalculateNLLS(high, current_index, m_high_channel);
}

//+------------------------------------------------------------------+
//| Calculate NLLS value for Low prices (wrapper function)           |
//+------------------------------------------------------------------+
double CalculateNLLSLow(const double &low[], int current_index)
{
    return CalculateNLLS(low, current_index, m_low_channel);
}

//+------------------------------------------------------------------+
//| Non-linear least squares calculation with price context         |
//+------------------------------------------------------------------+
double CalculateNonLinearLS(double &x[], double &y[], double &weights[], double price_context)
{
    int n = ArraySize(x);
    if(n != ArraySize(y) || n != ArraySize(weights))
        return(price_context); // Return price context as fallback
    
    return CalculateStableExponentialLS(x, y, weights, price_context);
}

//+------------------------------------------------------------------+
//| Stable exponential least squares calculation                    |
//+------------------------------------------------------------------+
double CalculateStableExponentialLS(double &x[], double &y[], double &weights[], double price_context)
{
    int n = ArraySize(x);
    
    // First, try a conservative exponential fit
    double result = TryExponentialFit(x, y, weights, price_context);
    
    // If exponential fit fails, use adaptive moving average
    if(!MathIsValidNumber(result) || result <= 0.0)
    {
        result = CalculateAdaptiveMA(y, weights);
    }
    
    // Final validation
    if(!MathIsValidNumber(result) || result <= 0.0)
    {
        result = price_context;
    }
    
    return result;
}

//+------------------------------------------------------------------+
//| Conservative exponential fitting with enhanced stability       |
//+------------------------------------------------------------------+
double TryExponentialFit(double &x[], double &y[], double &weights[], double price_context)
{
    int n = ArraySize(x);
    
    // Enhanced stability check
    double y_range = 0.0;
    double y_min = y[0], y_max = y[0];
    double y_mean = 0.0;
    
    for(int i = 0; i < n; i++)
    {
        if(y[i] < y_min) y_min = y[i];
        if(y[i] > y_max) y_max = y[i];
    }
    
    y_range = y_max - y_min;
    
    // Use decile mean for more robust central tendency
    if(UseDecileMean)
        y_mean = CalculateDecileMean(y);
    else
        y_mean = CalculateSimpleMean(y);
    
    // If range is too small or values are invalid, use weighted average
    if(y_range < y_mean * 0.001 || y_min <= 0.0 || !MathIsValidNumber(y_mean))
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    // Use a more conservative offset
    double offset = y_min - y_range * 0.01; // Reduced from 0.1 to 0.01
    
    // Transform to log space with enhanced validation
    double log_y[];
    ArrayResize(log_y, n);
    bool valid_transform = true;
    
    for(int i = 0; i < n; i++)
    {
        double adjusted_y = y[i] - offset;
        if(adjusted_y <= 0.0 || !MathIsValidNumber(adjusted_y))
        {
            valid_transform = false;
            break;
        }
        log_y[i] = MathLog(adjusted_y);
        if(!MathIsValidNumber(log_y[i]))
        {
            valid_transform = false;
            break;
        }
    }
    
    if(!valid_transform)
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    // Linear regression in log space with enhanced validation
    double sum_x = 0.0, sum_log_y = 0.0, sum_x_log_y = 0.0, sum_x_x = 0.0, sum_w = 0.0;
    
    for(int i = 0; i < n; i++)
    {
        if(!MathIsValidNumber(weights[i]) || weights[i] <= 0.0) continue;
        
        sum_x += weights[i] * x[i];
        sum_log_y += weights[i] * log_y[i];
        sum_x_log_y += weights[i] * x[i] * log_y[i];
        sum_x_x += weights[i] * x[i] * x[i];
        sum_w += weights[i];
    }
    
    if(sum_w <= 0.0 || !MathIsValidNumber(sum_w))
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    double mean_x = sum_x / sum_w;
    double mean_log_y = sum_log_y / sum_w;
    
    double numerator = sum_x_log_y - sum_w * mean_x * mean_log_y;
    double denominator = sum_x_x - sum_w * mean_x * mean_x;
    
    if(MathAbs(denominator) < 1e-10 || !MathIsValidNumber(numerator) || !MathIsValidNumber(denominator))
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    double b = numerator / denominator;
    double log_a = mean_log_y - b * mean_x;
    
    // Apply very strict bounds to prevent jumps
    if(MathAbs(b) > 0.01) // Reduced from 0.1 to 0.01
    {
        b = (b > 0) ? 0.01 : -0.01;
    }
    
    if(log_a > 5.0 || log_a < -5.0 || !MathIsValidNumber(log_a)) // Reduced bounds
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    // Calculate result with enhanced validation
    double a = MathExp(log_a);
    if(!MathIsValidNumber(a) || a <= 0.0)
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    double b_x_end = b * x[n-1];
    
    // Extra safety check with tighter bounds
    if(MathAbs(b_x_end) > 2.0 || !MathIsValidNumber(b_x_end)) // Reduced from 5.0 to 2.0
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    double exp_part = MathExp(b_x_end);
    if(!MathIsValidNumber(exp_part) || exp_part <= 0.0)
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    double result = a * exp_part + offset;
    
    // Final validation with price context
    if(!MathIsValidNumber(result) || result <= 0.0)
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    // Bounds check relative to price context and input data
    double max_deviation = y_range * 2.0; // Allow up to 2x the input range
    double lower_bound = y_mean - max_deviation;
    double upper_bound = y_mean + max_deviation;
    
    if(result < lower_bound || result > upper_bound)
    {
        return CalculateAdaptiveMA(y, weights);
    }
    
    return result;
}

//+------------------------------------------------------------------+
//| Enhanced adaptive moving average fallback with decile mean     |
//+------------------------------------------------------------------+
double CalculateAdaptiveMA(double &y[], double &weights[])
{
    int n = ArraySize(y);
    
    // If we have enough data and UseDecileMean is enabled, use decile mean
    if(UseDecileMean && n >= 10)
    {
        // Create weighted data array
        double weighted_data[];
        ArrayResize(weighted_data, 0);
        
        for(int i = 0; i < n; i++)
        {
            if(!MathIsValidNumber(y[i]) || !MathIsValidNumber(weights[i]) || weights[i] <= 0.0)
                continue;
            
            // Add multiple copies based on weight (normalized)
            int weight_copies = (int)MathMax(1, MathRound(weights[i] * 10.0));
            for(int j = 0; j < weight_copies; j++)
            {
                int new_size = ArraySize(weighted_data) + 1;
                ArrayResize(weighted_data, new_size);
                weighted_data[new_size - 1] = y[i];
            }
        }
        
        if(ArraySize(weighted_data) >= 10)
        {
            return CalculateDecileMean(weighted_data);
        }
    }
    
    // Fallback to weighted average with exponential decay
    double sum = 0.0, weight_sum = 0.0;
    
    for(int i = 0; i < n; i++)
    {
        if(!MathIsValidNumber(y[i]) || !MathIsValidNumber(weights[i]) || weights[i] <= 0.0)
            continue;
            
        double time_weight = MathExp(-0.05 * (n - 1 - i)); // Reduced decay rate
        double total_weight = weights[i] * time_weight;
        sum += y[i] * total_weight;
        weight_sum += total_weight;
    }
    
    if(weight_sum > 0.0 && MathIsValidNumber(sum / weight_sum))
        return sum / weight_sum;
    else
        return y[n-1]; // Return the most recent valid value
}

//+------------------------------------------------------------------+
//| Calculate volatility using True Range method with decile mean  |
//+------------------------------------------------------------------+
double CalculateVolatility(const double &price[], int current_index)
{
    int vol_period = MathMin(PeriodNLLS, current_index + 1);
    if(vol_period < 2) return(0.001);
    
    double sum_squared_returns = 0.0;
    double mean_return = 0.0;
    
    // Calculate returns
    double returns[];
    ArrayResize(returns, vol_period - 1);
    
    for(int i = 0; i < vol_period - 1; i++)
    {
        int idx1 = current_index + vol_period - 1 - i;
        int idx2 = current_index + vol_period - 2 - i;
        
        if(price[idx1] > 0.0) // Additional validation
        {
            returns[i] = (price[idx2] - price[idx1]) / price[idx1];
        }
        else
        {
            returns[i] = 0.0;
        }
    }
    
    // Use decile mean for more robust mean return calculation
    if(UseDecileMean && vol_period >= 12) // Need enough data for decile calculation
    {
        mean_return = CalculateDecileMean(returns);
    }
    else
    {
        mean_return = CalculateSimpleMean(returns);
    }
    
    // Calculate standard deviation of returns
    for(int i = 0; i < vol_period - 1; i++)
    {
        double deviation = returns[i] - mean_return;
        sum_squared_returns += deviation * deviation;
    }
    
    double volatility = MathSqrt(sum_squared_returns / (vol_period - 2));
    
    // Scale volatility by price level
    double price_level = price[current_index];
    volatility *= price_level * InpVolatilityFactor;
    
    return(MathMax(volatility, 0.001));
}

//+------------------------------------------------------------------+
//| Calculate volatility-adjusted weights                           |
//+------------------------------------------------------------------+
void CalculateVolatilityWeights(double &y[], double &weights[], double volatility, double price_scale)
{
    double price_range = 0.0;
    double min_price = y[0], max_price = y[0];
    
    // Find price range
    for(int i = 1; i < PeriodNLLS; i++)
    {
        if(y[i] < min_price) min_price = y[i];
        if(y[i] > max_price) max_price = y[i];
    }
    price_range = max_price - min_price;
    
    // Calculate weights based on recency and volatility
    for(int i = 0; i < PeriodNLLS; i++)
    {
        // Recency weight
        double recency_weight = 1.0 + (double)i / (PeriodNLLS - 1);
        
        // Distance from current price
        double current_price = y[PeriodNLLS - 1];
        double price_distance = MathAbs(y[i] - current_price);
        double distance_weight = 1.0;
        
        if(price_range > 0.0)
        {
            distance_weight = 1.0 - (price_distance / price_range) * 0.5;
        }
        
        // Volatility adjustment
        double volatility_adjustment = 1.0;
        if(volatility > 0.0)
        {
            double vol_ratio = volatility / (price_scale * 0.01);
            volatility_adjustment = 1.0 + vol_ratio * (double)i / (PeriodNLLS - 1);
        }
        
        // Combine weights
        weights[i] = recency_weight * distance_weight * volatility_adjustment;
        
        // Ensure minimum weight
        if(weights[i] < 0.1) weights[i] = 0.1;
    }
    
    // Normalize weights
    double weight_sum = 0.0;
    for(int i = 0; i < PeriodNLLS; i++)
        weight_sum += weights[i];
    
    if(weight_sum > 0.0)
    {
        for(int i = 0; i < PeriodNLLS; i++)
            weights[i] /= weight_sum;
    }
}

//+------------------------------------------------------------------+
//| Determine trend with backward-looking confirmation bars         |
//+------------------------------------------------------------------+
int DetermineTrend(int index, int prevTrend, const double &high[], const double &low[], int rates_total)
{
    double currentNLLS = (prevTrend == BEAR_TREND) ? HighNLLSBuffer[index] : LowNLLSBuffer[index];
    double yellowLineValue = (prevTrend == BEAR_TREND) ? low[index] : high[index];
    
    // Add validation for NLLS values
    if(currentNLLS <= 0.0 || !MathIsValidNumber(currentNLLS))
        return prevTrend;
    
    // Check if we have enough historical bars for confirmation
    if(index < ConfirmBars - 1)
        return prevTrend; // Not enough history for confirmation
    
    // Check for potential trend change signal at current bar
    bool potentialBullSignal = (prevTrend == BEAR_TREND && yellowLineValue > currentNLLS);
    bool potentialBearSignal = (prevTrend == BULL_TREND && yellowLineValue < currentNLLS);
    
    if(!potentialBullSignal && !potentialBearSignal)
        return prevTrend; // No signal, maintain current trend
    
    // Confirm the signal over the past ConfirmBars (including current)
    int confirmedBars = 0;
    
    for(int i = 0; i < ConfirmBars; i++)
    {
        int checkIndex = index - i;
        if(checkIndex < 0) break;
        
        // Get the appropriate NLLS line and price based on trend being tested
        double checkNLLS;
        double checkYellowValue;
        
        if(potentialBullSignal)
        {
            // Testing for bull trend - check if low stays above High NLLS
            checkNLLS = HighNLLSBuffer[checkIndex];
            checkYellowValue = low[checkIndex];
        }
        else if(potentialBearSignal)
        {
            // Testing for bear trend - check if high stays below Low NLLS
            checkNLLS = LowNLLSBuffer[checkIndex];
            checkYellowValue = high[checkIndex];
        }
        
        // Validate NLLS value
        if(checkNLLS <= 0.0 || !MathIsValidNumber(checkNLLS))
            continue;
        
        // Check if the signal condition is met for this bar
        if(potentialBullSignal && checkYellowValue > checkNLLS)
            confirmedBars++;
        else if(potentialBearSignal && checkYellowValue < checkNLLS)
            confirmedBars++;
    }
    
    // Change trend only if confirmed for ALL required bars
    if(confirmedBars >= ConfirmBars)
    {
        if(potentialBullSignal)
            return BULL_TREND;
        else if(potentialBearSignal)
            return BEAR_TREND;
    }
    
    return prevTrend; // Signal not confirmed, maintain current trend
}

//+------------------------------------------------------------------+
//| Set NLLS visibility based on trend                             |
//+------------------------------------------------------------------+
void SetNLLSVisibility(int index, int trend)
{
    if (trend == BEAR_TREND)
    {
        HighNLLSColors[index] = NLLS_ACTIVE;
        LowNLLSColors[index] = NLLS_INACTIVE;
    }
    else
    {
        HighNLLSColors[index] = NLLS_INACTIVE;
        LowNLLSColors[index] = NLLS_ACTIVE;
    }
}

//+------------------------------------------------------------------+
//| Set adaptive line values and colors                             |
//+------------------------------------------------------------------+
void SetAdaptiveLine(int index, int trend, const double &high[], const double &low[])
{
    AdaptiveLineBuffer[index] = (trend == BEAR_TREND) ? low[index] : high[index];
    
    double referenceNLLS = (trend == BEAR_TREND) ? HighNLLSBuffer[index] : LowNLLSBuffer[index];
    bool isDecling = false;
    
    if (index < ArraySize(AdaptiveLineBuffer) - 1 && index > 0)
    {
        isDecling = (AdaptiveLineBuffer[index] < AdaptiveLineBuffer[index + 1]);
    }
    
    if (isDecling)
    {
        AdaptiveLineColors[index] = (trend == BULL_TREND) ? ADAPTIVE_YELLOW : ADAPTIVE_RED;
    }
    else if (AdaptiveLineBuffer[index] < referenceNLLS)
    {
        AdaptiveLineColors[index] = ADAPTIVE_YELLOW;
    }
    else
    {
        AdaptiveLineColors[index] = ADAPTIVE_BLUE;
    }
}

//+------------------------------------------------------------------+
//| Custom indicator iteration function                              |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
    if (rates_total < minBarsRequired)
        return 0;
    
    // Set arrays as time-descending
    ArraySetAsSeries(open, true);
    ArraySetAsSeries(high, true);
    ArraySetAsSeries(low, true);
    ArraySetAsSeries(close, true);
    ArraySetAsSeries(time, true);
    
    // Calculate processing range
    int startPos = (prev_calculated == 0) ? rates_total - minBarsRequired : rates_total - prev_calculated;
    startPos = MathMax(0, MathMin(startPos, rates_total - PeriodNLLS));
    
    // Calculate NLLS values
    double tempHighNLLS[], tempLowNLLS[];
    ArrayResize(tempHighNLLS, rates_total);
    ArrayResize(tempLowNLLS, rates_total);
    ArraySetAsSeries(tempHighNLLS, true);
    ArraySetAsSeries(tempLowNLLS, true);
    
    for (int i = startPos; i >= 0; i--)
    {
        // Use the new refactored wrapper functions
        tempHighNLLS[i] = CalculateNLLSHigh(high, i);
        tempLowNLLS[i] = CalculateNLLSLow(low, i);
        
        // Additional validation
        if(tempHighNLLS[i] <= 0.0 || !MathIsValidNumber(tempHighNLLS[i]))
        {
            tempHighNLLS[i] = (i < rates_total - 1) ? HighNLLSBuffer[i + 1] : high[i];
        }
        
        if(tempLowNLLS[i] <= 0.0 || !MathIsValidNumber(tempLowNLLS[i]))
        {
            tempLowNLLS[i] = (i < rates_total - 1) ? LowNLLSBuffer[i + 1] : low[i];
        }
    }
    
    // Apply smoothing
    ApplySmoothing(tempHighNLLS, HighNLLSBuffer, rates_total, startPos);
    ApplySmoothing(tempLowNLLS, LowNLLSBuffer, rates_total, startPos);
    
    // Process each bar
    for (int i = startPos; i >= 0; i--)
    {
        // Initialize if no valid NLLS data
        if (HighNLLSBuffer[i] <= 0.0 || LowNLLSBuffer[i] <= 0.0 || 
            !MathIsValidNumber(HighNLLSBuffer[i]) || !MathIsValidNumber(LowNLLSBuffer[i]))
        {
            TrendBuffer[i] = BULL_TREND;
            SetNLLSVisibility(i, BULL_TREND);
            SetAdaptiveLine(i, BULL_TREND, high, low);
            continue;
        }
        
        // Determine trend with proper confirmation
        int currentTrend;
        if (i >= rates_total - 1 || i >= startPos)
        {
            // Initial trend based on price position
            double midPrice = (high[i] + low[i]) * 0.5;
            double midNLLS = (HighNLLSBuffer[i] + LowNLLSBuffer[i]) * 0.5;
            currentTrend = (midPrice > midNLLS) ? BULL_TREND : BEAR_TREND;
        }
        else
        {
            int prevTrend = (int)TrendBuffer[i + 1];
            // Use backward-looking confirmation (more practical for real-time)
            currentTrend = DetermineTrend(i, prevTrend, high, low, rates_total);
        }
        
        TrendBuffer[i] = currentTrend;
        SetNLLSVisibility(i, currentTrend);
        SetAdaptiveLine(i, currentTrend, high, low);
    }
    
    return rates_total;
}