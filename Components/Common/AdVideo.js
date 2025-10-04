// AdVideo.js
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import Video from 'react-native-video';
import Ionicons from '@react-native-vector-icons/material-design-icons';

const AdVideo = ({
  source,
  onClose,
  style,
  initialMuted = true,
  autoPlay = true,
  onMuteChange,
}) => {
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [fullScreen, setFullScreen] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => setIsMuted(initialMuted), [initialMuted]);

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      onMuteChange?.(next);
      return next;
    });
  };

  return (
    <>
      {/* Mini Player */}
      <View style={[styles.container, style]} pointerEvents="box-none">
        <Video
          ref={playerRef}
          source={source}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={!autoPlay}
          muted={isMuted}
          onLoad={() => setLoading(false)}
          onLoadStart={() => setLoading(true)}
        />
        {loading && <ActivityIndicator style={styles.loader} />}

        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close-circle" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Mute */}
        <TouchableOpacity style={styles.soundBtn} onPress={toggleMute}>
          <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={26} color="#fff" />
        </TouchableOpacity>

        {/* Full Screen */}
        <TouchableOpacity style={styles.fullScreenBtn} onPress={() => setFullScreen(true)}>
          <Ionicons name="arrow-expand" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Full Screen Modal */}
      <Modal visible={fullScreen} animationType="fade" transparent={false}>
        <View style={styles.fullScreenContainer}>
          <Video
            source={source}
            style={styles.fullScreenVideo}
            resizeMode="contain"
            repeat
            muted={false} // audio ON in full screen
            controls
          />

          <TouchableOpacity style={styles.closeFullScreenBtn} onPress={() => setFullScreen(false)}>
            <Ionicons name="close-circle" size={35} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 140,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 12,
    zIndex: 999,
  },
  video: { width: '100%', height: '100%' },
  loader: { position: 'absolute', top: '45%', left: '45%' },
  closeBtn: { position: 'absolute', top: 6, right: 6 },
  soundBtn: { position: 'absolute', top: 6, left: 6 },
  fullScreenBtn: { position: 'absolute', bottom: 6, right: 6 },

  fullScreenContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  fullScreenVideo: { width: '100%', height: '100%' },
  closeFullScreenBtn: { position: 'absolute', top: 20, right: 20 },
});

export default AdVideo;
