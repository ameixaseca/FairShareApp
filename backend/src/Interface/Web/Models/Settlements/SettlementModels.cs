namespace FairShareApp.Backend.Web.Models.Settlements;

public sealed record CreateSettlementRequest(Guid GroupId, Guid FromUserId, Guid ToUserId, decimal Amount);

public sealed record SettlementView(Guid Id, Guid FromUserId, Guid ToUserId, decimal Amount, DateTimeOffset SettledAt);

public sealed record NotificationPreferenceView(Guid GroupId, bool InAppEnabled, bool EmailEnabled, bool TelegramEnabled);

public sealed record UpdateNotificationPreferenceRequest(bool InAppEnabled, bool EmailEnabled, bool TelegramEnabled);
