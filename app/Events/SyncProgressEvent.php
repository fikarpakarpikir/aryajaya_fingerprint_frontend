<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SyncProgressEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $progress;

    public function __construct($progress)
    {
        // dd($progress);
        $this->progress = $progress;
    }
    // public function broadcastOn()
    // {
    //     return new Channel('sync-progress');
    // }
    public function broadcastOn()
    {
        // channel public
        return new Channel('sync-progress');
    }

    public function broadcastAs()
    {
        // nama event custom
        return 'SyncProgress';
    }

    public function broadcastWith()
    {
        return $this->progress;
    }
}
