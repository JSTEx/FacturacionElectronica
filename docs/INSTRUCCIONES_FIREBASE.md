# Configuración Firebase - Autenticación y Seguridad

## ✅ Implementación completada

El sistema usa **Firebase Email/Password Authentication** para login y control de acceso.

## 📋 Pasos de configuración

### 1) Habilitar Email/Password en Firebase

1. Ve a Firebase Console.
2. Abre tu proyecto: **facturacionelectronica-c2155**.
3. En **Authentication** → **Sign-in method**.
4. Activa **Email/Password** y guarda.

### 2) Crear usuario admin inicial

#### Opción A (recomendada): desde Firebase Console

1. Ve a **Authentication** → **Users**.
2. Crea un usuario:

   - Email: `admin@admin.com`
   - Password: `admin123` (cámbiala luego)

Luego agrega ese usuario en Realtime Database dentro de `users`:

```json
{
  "users": [
    {
      "email": "admin@admin.com",
      "role": "admin"
    }
  ]
}
```

### 3) Reglas de Realtime Database (recomendadas para producción)

En **Realtime Database** → **Rules**, publica reglas por rol y validación básica de campos.

> Nota: estas reglas asumen que `users` está indexado por `uid` (ejemplo: `/users/<uid>/role`).

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
        "role": {
          ".validate": "newData.val() === 'admin' || newData.val() === 'user'"
        }
      }
    },
    "invoices": {
      "$invoiceId": {
        ".read": "auth != null",
        ".write": "auth != null && (data.exists() ? (data.child('createdByEmail').val() === auth.token.email || root.child('users').child(auth.uid).child('role').val() === 'admin') : true)",
        "number": { ".validate": "newData.isString() && newData.val().length > 0" },
        "client": { ".validate": "newData.isString() && newData.val().length > 0" },
        "amount": { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "status": { ".validate": "newData.isString()" },
        "createdByEmail": { ".validate": "newData.isString() && newData.val().length > 0" },
        "updatedAt": { ".validate": "newData.isString()" },
        "updatedByEmail": { ".validate": "newData.isString()" }
      }
    },
    "adminAudit": {
      "$entry": {
        ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    }
  }
}
```

### 4) Buenas prácticas de seguridad de datos

- Guarda cada usuario en `/users/<uid>` para reglas más seguras.
- No permitas que un usuario edite facturas que no creó (excepto admin).
- Valida tipos mínimos (`number`, `string`) en campos críticos.
- Guarda trazabilidad: `createdAt`, `updatedAt`, `updatedByEmail`, `changeLog`.

## 🔐 Flujo actual

- `pages/login.html`: autentica con Firebase Auth.
- `index.html`: requiere sesión válida para gestionar facturas.
- `pages/admin.html`: requiere sesión y rol `admin`.

## ⚠️ Migración de usuarios antiguos

Si tenías usuarios del esquema anterior:

1. Debes crearlos nuevamente desde `pages/admin.html` o Firebase Console.
2. Verifica que también existan en `users` con su `role`.

## 🧪 Pruebas rápidas

1. Inicia sesión con admin.
2. Crea un usuario nuevo desde `pages/admin.html`.
3. Verifica acceso:

   - Usuario normal → `index.html`
   - Admin → `pages/admin.html`

4. Confirma que sin sesión redirige a `pages/login.html`.

## 🆘 Errores comunes

- `auth/invalid-credential`: credenciales inválidas o usuario no existe en Auth.
- `Permission denied`: reglas de Realtime Database no publicadas correctamente.
- Login exitoso pero sin acceso: falta el usuario en `/users` o no tiene `role`.
