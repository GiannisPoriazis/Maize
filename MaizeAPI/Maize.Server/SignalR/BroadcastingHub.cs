using Microsoft.AspNetCore.SignalR;

namespace Maize.Server.SignalR
{
    public class BroadcastingHub: Hub
    {
        public async Task SendAction(ushort action, short userId)
        {
            await Clients.All.SendAsync("ReceiveAction", action, userId);
        }
    }
}
