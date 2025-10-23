// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, WebviewWindow, WebviewWindowBuilder, WebviewUrl};
use tauri_plugin_store::StoreBuilder;

// Data structures
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Todo {
    id: String,
    text: String,
    done: bool,
    created_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Note {
    id: String,
    content: String,
    updated_at: i64,
}

// State management
struct AppState {
    todos: Mutex<Vec<Todo>>,
    notes: Mutex<HashMap<String, Note>>,
    settings: Mutex<Settings>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Settings {
    muted: bool,
    collapsed: bool,
    theme: String,
    selected_music: Option<String>,
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            muted: true,
            collapsed: false,  // Start expanded for now to see the full app
            theme: "dark".to_string(),
            selected_music: None,
        }
    }
}

// Commands
#[tauri::command]
fn get_todos(state: tauri::State<AppState>) -> Vec<Todo> {
    state.todos.lock().unwrap().clone()
}

#[tauri::command]
fn add_todo(text: String, state: tauri::State<AppState>) -> Todo {
    let todo = Todo {
        id: uuid::Uuid::new_v4().to_string(),
        text,
        done: false,
        created_at: chrono::Utc::now().timestamp(),
    };
    state.todos.lock().unwrap().push(todo.clone());
    todo
}

#[tauri::command]
fn toggle_todo(id: String, state: tauri::State<AppState>) -> Result<Todo, String> {
    let mut todos = state.todos.lock().unwrap();
    match todos.iter_mut().find(|t| t.id == id) {
        Some(todo) => {
            todo.done = !todo.done;
            Ok(todo.clone())
        }
        None => Err("Todo not found".to_string()),
    }
}

#[tauri::command]
fn delete_todo(id: String, state: tauri::State<AppState>) -> Result<(), String> {
    let mut todos = state.todos.lock().unwrap();
    todos.retain(|t| t.id != id);
    Ok(())
}

#[tauri::command]
fn save_note(id: String, content: String, state: tauri::State<AppState>) -> Note {
    let note = Note {
        id: id.clone(),
        content,
        updated_at: chrono::Utc::now().timestamp(),
    };
    state.notes.lock().unwrap().insert(id, note.clone());
    note
}

#[tauri::command]
fn get_note(id: String, state: tauri::State<AppState>) -> Option<Note> {
    state.notes.lock().unwrap().get(&id).cloned()
}

#[tauri::command]
fn get_settings(state: tauri::State<AppState>) -> Settings {
    state.settings.lock().unwrap().clone()
}

#[tauri::command]
fn save_settings(settings: Settings, state: tauri::State<AppState>) {
    *state.settings.lock().unwrap() = settings;
}

#[tauri::command]
async fn open_note_window(app: AppHandle) -> Result<(), String> {
    let note_id = uuid::Uuid::new_v4().to_string();
    
    let _note_window = WebviewWindowBuilder::new(
        &app,
        &format!("note_{}", note_id),
        WebviewUrl::App("index.html#/note".into())
    )
    .title("Sticky Note")
    .inner_size(360.0, 420.0)
    .resizable(true)
    .decorations(false)
    .always_on_top(true)
    .skip_taskbar(false)
    .build()
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn toggle_window_size(window: WebviewWindow, collapsed: bool) -> Result<(), String> {
    if collapsed {
        // Collapsed state - duck avatar with progress (110x110)
        window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
            width: 110,
            height: 110,
        })).map_err(|e| e.to_string())?;
        
        // Hide from taskbar when collapsed
        window.set_skip_taskbar(true).map_err(|e| e.to_string())?;
    } else {
        // Expanded state - full timer widget (270x370)
        window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
            width: 270,
            height: 370,
        })).map_err(|e| e.to_string())?;
        
        // Show in taskbar when expanded
        window.set_skip_taskbar(false).map_err(|e| e.to_string())?;
        
        // Center the window when expanding
        window.center().map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn main() {
    let app_state = AppState {
        todos: Mutex::new(Vec::new()),
        notes: Mutex::new(HashMap::new()),
        settings: Mutex::new(Settings::default()),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            get_todos,
            add_todo,
            toggle_todo,
            delete_todo,
            save_note,
            get_note,
            get_settings,
            save_settings,
            open_note_window,
            toggle_window_size,
        ])
        .setup(|app| {
            // Initialize store for persistence
            let _store = StoreBuilder::new(app.handle(), "waffle_timer.bin").build();
            
            // The window starts at 420x560 (expanded) as configured in tauri.conf.json
            // The frontend will handle showing collapsed/expanded based on settings
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}