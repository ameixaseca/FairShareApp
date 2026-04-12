using FairShareApp.Backend.Domain.Groups;

namespace FairShareApp.Backend.Application.UseCases.Groups;

public sealed class CreateGroupUseCase
{
    public Group Execute(string name, string currency, Guid ownerId)
    {
        return new Group(name, currency, ownerId);
    }
}
