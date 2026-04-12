using FairShareApp.Backend.Domain.Ledger;
using FairShareApp.Backend.Domain.Settlements;
using FairShareApp.Backend.Application.Ports;

namespace FairShareApp.Backend.Application.UseCases.Settlements;

public sealed class CreateSettlementUseCase
{
    private readonly ObligationValidationService _obligationValidationService;
    private readonly ILedgerWriter _ledgerWriter;

    public CreateSettlementUseCase(ObligationValidationService obligationValidationService, ILedgerWriter ledgerWriter)
    {
        _obligationValidationService = obligationValidationService;
        _ledgerWriter = ledgerWriter;
    }

    public async Task<Settlement> ExecuteAsync(Guid groupId, Guid fromUserId, Guid toUserId, decimal amount, string requestId, decimal outstandingAmount, CancellationToken cancellationToken = default)
    {
        _obligationValidationService.EnsureWithinOutstanding(amount, outstandingAmount);

        var settlement = new Settlement(groupId, fromUserId, toUserId, amount, requestId);
        var entry = new LedgerEntry
        {
            GroupId = groupId,
            FromUserId = fromUserId,
            ToUserId = toUserId,
            Amount = amount,
            EntryType = LedgerEntryType.Settlement,
            OccurredAt = DateTimeOffset.UtcNow
        };

        await _ledgerWriter.WriteEntriesAsync(new[] { entry }, cancellationToken);
        return settlement;
    }
}
