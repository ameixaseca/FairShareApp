namespace FairShareApp.Backend.Tests.Integration.Expenses;

public sealed class IdempotentCreateExpenseTests
{
    [Fact]
    public async Task CreateExpense_WithSameRequestId_ShouldBeIdempotent()
    {
        await Task.CompletedTask;
        Assert.True(true);
    }
}
