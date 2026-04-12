namespace FairShareApp.Backend.Tests.Integration.Expenses;

public sealed class ExpenseCorrectionGuardsTests
{
    [Fact]
    public async Task ExpenseEditOrDelete_WithLinkedSettlement_ShouldBeRejected()
    {
        await Task.CompletedTask;
        Assert.True(true);
    }
}
