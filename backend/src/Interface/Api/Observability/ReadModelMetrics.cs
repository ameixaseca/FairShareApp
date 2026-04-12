using System.Diagnostics.Metrics;

namespace FairShareApp.Backend.Interface.Api.Observability;

public sealed class ReadModelMetrics
{
    private static readonly Meter Meter = new("FairShareApp.ReadModel", "1.0.0");
    private static readonly Histogram<double> ProjectionLatencySeconds = Meter.CreateHistogram<double>("balance_projection_delay_seconds");

    public void RecordProjectionLatency(TimeSpan latency)
    {
        ProjectionLatencySeconds.Record(latency.TotalSeconds);
    }
}
