import { Platform, NativeModules } from 'react-native';
import TrackPlayer, { Event, State } from 'react-native-track-player';
import { SetupService } from './SetupService';
import { QueueInitialTracksService } from './QueueInitialTracksService';

const { RNTPWidgetModule } = NativeModules;

export async function PlaybackService() {
  (async () => {
    await SetupService(true);
    await QueueInitialTracksService();
  })();
  console.log('registering playback listeners');
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log('Event.RemotePause');
    TrackPlayer.fadeOutPause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log('Event.RemotePlay');
    TrackPlayer.play();
    TrackPlayer.setAnimatedVolume({
      volume: 1,
    });
  });

  TrackPlayer.addEventListener(Event.RemotePlayPause, async () => {
    console.log('Event.RemotePlayPause');
    if ((await TrackPlayer.getPlaybackState()).state === State.Playing) {
      TrackPlayer.fadeOutPause();
    } else {
      TrackPlayer.play();
      TrackPlayer.setAnimatedVolume({
        volume: 1,
      });
    }
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log('Event.RemoteNext');
    TrackPlayer.fadeOutNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log('Event.RemotePrevious');
    TrackPlayer.fadeOutPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
    console.log('Event.RemoteJumpForward', event);
    TrackPlayer.seekBy(event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
    console.log('Event.RemoteJumpBackward', event);
    TrackPlayer.seekBy(-event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    console.log('Event.RemoteSeek', event);
    TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    console.log('Event.RemoteDuck', event);
  });

  if (Platform.OS === 'android') {
    TrackPlayer.addEventListener(Event.RemotePlayId, async (event) => {
      console.log('Event.RemotePlayId', event);
      // For demonstration purposes, the mediaId of playable mediaItems in the content hierarchy
      // is set to its index, and thus we are able to use TrackPlayer.skip. It's recommended
      // users build their own playback methods and mediaIds to handle playback.
      TrackPlayer.setPlaybackState(event.id);
      TrackPlayer.skip(Number(event.id)).then(() => TrackPlayer.play());
    });

    TrackPlayer.addEventListener(Event.RemotePlaySearch, (event) => {
      console.log('Event.RemotePlaySearch', event);
      // For demonstration purposes, code below searches if queue contains "soul"; then
      // TrackPlayer plays the 2nd song (Soul Searching) in the queue. users must build their own search-playback
      // methods to handle this event.
      if (event.query.toLowerCase().includes('soul')) {
        TrackPlayer.skip(1).then(() => TrackPlayer.play());
      }
    });

    TrackPlayer.addEventListener(Event.RemoteSkip, (event) => {
      // As far as I can tell, Event.RemoteSkip is an android only event that handles the "queue" button (top right)
      // clicks in android auto. it simply emits an index in the current queue to be played.
      console.log('Event.RemoteSkip', event);
      TrackPlayer.skip(event.index).then(() => TrackPlayer.play());
    });

    TrackPlayer.addEventListener(Event.RemoteBrowse, (event) => {
      // This event is emitted when onLoadChildren is called. the mediaId is returned to allow RNTP to handle any
      // content updates.
      console.log('Event.RemoteBrowse', event);
    });
  }

  TrackPlayer.addEventListener(Event.RemoteCustomAction, (event) => {
    console.log('Event.RemoteCustomAction', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
    console.log('Event.PlaybackQueueEnded', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    console.log('Event.PlaybackActiveTrackChanged', event);
    RNTPWidgetModule?.updateWidget();
  });

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
    console.log('Event.PlaybackProgressUpdated', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackPlayWhenReadyChanged, (event) => {
    console.log('Event.PlaybackPlayWhenReadyChanged', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    console.log('Event.PlaybackState', event);
    RNTPWidgetModule?.updateWidget();
  });

  TrackPlayer.addEventListener(Event.PlaybackMetadataReceived, (event) => {
    console.log('[Deprecated] Event.PlaybackMetadataReceived', event);
  });

  TrackPlayer.addEventListener(Event.MetadataChapterReceived, (event) => {
    console.log('Event.MetadataChapterReceived', event);
  });

  TrackPlayer.addEventListener(Event.MetadataTimedReceived, (event) => {
    console.log('Event.MetadataTimedReceived', event);
  });

  TrackPlayer.addEventListener(Event.MetadataCommonReceived, (event) => {
    console.log('Event.MetadataCommonReceived', event);
  });
  
  TrackPlayer.addEventListener(Event.PlaybackAudioTapReceived, (event) => {
    console.log('Event.PlaybackAudioTapReceived', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackAnimatedVolumeChanged, (event) => {
    console.log('Event.PlaybackAnimatedVolumeChanged', event.data);
  });

  TrackPlayer.addEventListener(
    Event.PlaybackMetadataReceived,
    async ({ title, artist }) => {
      const activeTrack = await TrackPlayer.getActiveTrack();
      TrackPlayer.updateNowPlayingMetadata({
        artist: [title, artist].filter(Boolean).join(' - '),
        title: activeTrack?.title,
        artwork: activeTrack?.artwork,
      });
    }
  );
}
