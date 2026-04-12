using FairShareApp.Backend.Tests.Web.TestInfrastructure;

namespace FairShareApp.Backend.Tests.Web.Layout;

public sealed class ResponsivenessContractTests
{
    [Fact]
    public void ResponsiveCss_ShouldContainTabletAndDesktopBreakpoints()
    {
        var css = File.ReadAllText(TestPaths.WebProjectPath("Styles", "Responsive.css"));

        Assert.Contains("@media (min-width: 768px)", css, StringComparison.Ordinal);
        Assert.Contains("@media (min-width: 1200px)", css, StringComparison.Ordinal);
        Assert.Contains(".fs-grid-2", css, StringComparison.Ordinal);
    }

    [Fact]
    public void NavMenuCss_ShouldContainMobileToDesktopBreakpointBehavior()
    {
        var css = File.ReadAllText(TestPaths.WebProjectPath("Components", "Layout", "NavMenu.razor.css"));

        Assert.Contains("@media (min-width: 641px)", css, StringComparison.Ordinal);
        Assert.Contains(".navbar-toggler", css, StringComparison.Ordinal);
        Assert.Contains(".nav-scrollable", css, StringComparison.Ordinal);
    }

    [Fact]
    public void FinancialTokens_ShouldDefinePositiveAndNegativeSemanticStyles()
    {
        var css = File.ReadAllText(TestPaths.WebProjectPath("Styles", "Tokens.css"));

        Assert.Contains("--fs-positive", css, StringComparison.Ordinal);
        Assert.Contains("--fs-negative", css, StringComparison.Ordinal);
        Assert.Contains(".amount-positive", css, StringComparison.Ordinal);
        Assert.Contains(".amount-negative", css, StringComparison.Ordinal);
    }

    [Fact]
    public void KeyPages_ShouldUseResponsiveGridAndCardClasses()
    {
        var groupsPage = File.ReadAllText(TestPaths.WebProjectPath("Pages", "Groups", "GroupsPage.razor"));
        var dashboardPage = File.ReadAllText(TestPaths.WebProjectPath("Pages", "Dashboard", "GroupDashboardPage.razor"));

        Assert.Contains("fs-grid-2", groupsPage, StringComparison.Ordinal);
        Assert.Contains("financial-card", groupsPage, StringComparison.Ordinal);
        Assert.Contains("fs-grid-2", dashboardPage, StringComparison.Ordinal);
        Assert.Contains("financial-card", dashboardPage, StringComparison.Ordinal);
    }
}
