use tauri_plugin_shell::ShellExt;

#[tauri::command]
async fn download_media(app: tauri::AppHandle, youtube_url: String, download_path: String) -> Result<String, String> {
  let sidecar_command = app.shell().sidecar("binaries/yt-dlp").map_err(|e| e.to_string())?;
  let output = sidecar_command
    .args([&youtube_url, "-o", &download_path])
    .output()
    .await
    .map_err(|e| e.to_string())?;

  if output.status.success() {
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
  } else {
    Err(String::from_utf8_lossy(&output.stderr).to_string())
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_store::Builder::new().build())
    .invoke_handler(tauri::generate_handler![download_media])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
