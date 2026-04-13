import type { InviteResponse } from '../../../types/invites'

interface InviteTableProps {
  invites: InviteResponse[]
}

export const InviteTable = ({ invites }: InviteTableProps): React.JSX.Element => {
  if (!invites.length) {
    return <p className="text-sm text-slate-500">Nenhum convite enviado.</p>
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="px-2 py-2">Destinatário</th>
            <th className="px-2 py-2">Canal</th>
            <th className="px-2 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite) => (
            <tr className="border-t border-slate-200" key={invite.id}>
              <td className="px-2 py-2">{invite.recipient}</td>
              <td className="px-2 py-2">{invite.channel}</td>
              <td className="px-2 py-2">{invite.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
