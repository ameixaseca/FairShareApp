namespace FairShareApp.Backend.Tests.Web.TestInfrastructure;

internal static class TestPaths
{
    public static string RepositoryRoot()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);

        while (current is not null)
        {
            var expected = Path.Combine(current.FullName, "backend", "FairShareApp.Backend.sln");
            if (File.Exists(expected))
            {
                return current.FullName;
            }

            current = current.Parent;
        }

        throw new DirectoryNotFoundException("Could not locate repository root from test base directory.");
    }

    public static string WebProjectPath(params string[] segments)
    {
        var all = new[]
        {
            RepositoryRoot(),
            "backend",
            "src",
            "Interface",
            "Web"
        }.Concat(segments).ToArray();

        return Path.Combine(all);
    }
}
