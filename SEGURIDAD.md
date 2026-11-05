# Seguridad — credenciales y secretos

Esta guía sirve si un archivo con credenciales llegó a Git o a un repositorio
público. **Rotar las credenciales es siempre el primer paso**: borrar el archivo
del historial no invalida una contraseña que ya fue publicada.

## 1. Rotar la contraseña de MongoDB (Atlas)

1. Entra a <https://cloud.mongodb.com> y abre tu proyecto.
2. Ve a **Security → Database Access**.
3. Busca el usuario de la base de datos (por ejemplo el que empieza con
   `kaguirrecrespin_db_user`) y pulsa **Edit**.
4. Pulsa **Edit Password → Autogenerate Secure Password** y guarda la nueva
   contraseña en un lugar seguro.
5. Pulsa **Update User**.
6. Actualiza la cadena de conexión en tu `.env` local y en las variables de
   entorno de tu hosting (Render, Railway, etc.).
7. Si la contraseña tiene caracteres especiales (`@`, `:`, `/`, `?`, `#`),
   codifícala para la URL con:

   ```powershell
   node -e "console.log(encodeURIComponent('TU_NUEVA_PASSWORD'))"
   ```

8. Revisa **Security → Network Access** y limita las IPs permitidas si es
   posible. Revisa también los usuarios y privilegios de la base de datos.

## 2. Rotar el token del panel

El `ADMIN_TOKEN` protege `/admin` y las rutas privadas de mensajes. Si se
publicó, cualquiera podría leer o borrar mensajes con él.

1. Genera un token nuevo:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Cópialo en `.env`:

   ```env
   ADMIN_TOKEN=el-token-nuevo
   ```

3. Actualiza la misma variable en el hosting y **redespliega** el servicio.
4. El token anterior deja de funcionar. Tendrás que volver a entrar al panel
   con el nuevo.

## 3. Sacar el archivo de Git

Ya está hecho en el repositorio local: `prueba.env` dejó de rastrearse y
`.gitignore` ahora ignora `.env`, `.env.*` y `*.env` (excepto `.env.example`).

Para confirmarlo:

```powershell
git status
git ls-files | Select-String "env"
```

El archivo local `prueba.env` se conserva. Renómbralo a `.env` cuando tengas las
credenciales nuevas, o copia sus valores a tu `.env` y elimínalo:

```powershell
Copy-Item prueba.env .env
```

> No borres `prueba.env` hasta haber copiado lo que necesites: aunque ya no se
> sube a Git, sigue existiendo solo en tu equipo.

## 4. Limpiar el historial (opcional pero recomendado)

Aunque el archivo ya no se rastree, sigue estando en commits anteriores y en la
rama `origin/develop`. Para eliminarlo de todo el historial:

> ⚠️ Esto reescribe el historial. Haz una copia de seguridad antes y no lo hagas
> si otras personas trabajan en el repositorio sin coordinarlo.

```powershell
# Copia de seguridad fuera del proyecto
git clone --mirror https://github.com/dodiexsss/fib-sudio.git fib-sudio-backup.git

# Instala git-filter-repo (requiere Python)
pip install git-filter-repo

# Elimina prueba.env de todos los commits
git filter-repo --path prueba.env --invert-paths --force

# filter-repo quita el remoto; vuelve a añadirlo
git remote add origin https://github.com/dodiexsss/fib-sudio.git

# Publica el historial limpio
git push origin --force --all
git push origin --force --tags
```

Después de un `push --force`, GitHub puede conservar durante un tiempo commits
antiguos accesibles por su SHA o en caché. Si necesitas borrarlos por completo,
contacta al soporte de GitHub. Por eso la rotación de credenciales es
obligatoria, incluso si limpias el historial.

Si no quieres reescribir el historial: elimina el archivo en un commit normal,
haz `push` y **rota igualmente todas las credenciales**.

## 5. Revisar si hubo uso no autorizado

- Mira los mensajes del panel `/admin`: si hay mensajes o cambios que no
  reconoces, puede que alguien haya usado el token.
- En Atlas revisa la actividad del clúster y los usuarios conectados.
- Si usas el plan gratuito de Atlas, las opciones de auditoría son limitadas;
  ante la duda, rota credenciales y revisa los datos.

## 6. Prevención

- Nunca subas `.env`, `prueba.env` ni archivos con contraseñas, tokens o URIs.
- Usa `.env.example` solo con valores vacíos o de ejemplo.
- Configura los secretos en el panel de tu hosting, no en el repositorio.
- No pegues credenciales en capturas, issues, chats o commits.
- Activa el escaneo de secretos de GitHub (en repositorios públicos viene
  activado) y, si puedes, usa `gitleaks` antes de cada push.
- Usa un usuario de MongoDB con permisos solo sobre la base `fibstudio` y una
  lista de IPs permitidas.
