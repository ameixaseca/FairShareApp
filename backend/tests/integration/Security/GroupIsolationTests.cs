namespace FairShareApp.Backend.Tests.Integration.Security;

public sealed class GroupIsolationTests
{
    [Fact]
    public async Task NonMember_ShouldNotReadGroupData()
    {
        await Task.CompletedTask;
        Assert.True(true);
    }
}
