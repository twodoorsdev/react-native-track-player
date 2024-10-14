package com.lovegaoshi.kotlinaudio.models

import android.os.Bundle
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.CommandButton
import androidx.media3.session.SessionCommand

@UnstableApi
data class CustomButton (
    val displayName: String = "",
    val iconRes: Int = 0,
    val sessionCommand: String = "",
    val onLayout: Boolean = false,
    val commandButton: CommandButton = CommandButton.Builder(CommandButton.ICON_UNDEFINED)
        .setDisplayName(displayName)
        .setIconResId(iconRes)
        .setSessionCommand(SessionCommand(sessionCommand, Bundle()))
        .build()
)