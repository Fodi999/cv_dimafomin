# Cloudinary Setup Instructions

## 📸 Настройка Cloudinary для загрузки аватаров

### Шаг 1: Создайте аккаунт на Cloudinary

1. Перейдите на [https://cloudinary.com/](https://cloudinary.com/)
2. Нажмите "Sign Up Free"
3. Заполните форму регистрации

### Шаг 2: Получите учетные данные

После регистрации вы попадете в Dashboard, где найдете:

```
Cloud Name: your_cloud_name
API Key: your_api_key
API Secret: your_api_secret
```

### Шаг 3: Создайте Upload Preset

1. В левом меню перейдите в **Settings** → **Upload**
2. Прокрутите вниз до секции **Upload presets**
3. Нажмите **Add upload preset**
4. Настройте preset:
   - **Preset name**: `cv_sushi_chef`
   - **Signing Mode**: **Unsigned** (важно!)
   - **Folder**: `sushi_chef_avatars` (опционально)
   - **Access Mode**: **Public**
   - **Allowed formats**: `jpg,png,webp`
   - **Max file size**: `5MB`
   - **Transformation**: Добавьте transformation для оптимизации:
     - Width: 500
     - Height: 500
     - Crop: fill
     - Quality: auto
     - Format: auto
5. Нажмите **Save**

### Шаг 4: Обновите `.env.local`

Откройте файл `.env.local` и замените значения:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cv_sushi_chef
```

**Важно:** Замените `your_cloud_name_here` на ваш реальный Cloud Name из Dashboard!

---

## ⚠️ Improved Error Handling (NEW)

### Smart Error Messages

The application now includes intelligent error handling for Cloudinary uploads:

#### ❌ Cloudinary Not Configured
If you see this error:
```
Cloudinary nie jest skonfigurowany. 
Ustaw NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME w pliku .env.local
```

**This means:**
- You haven't replaced `your_cloud_name` in `.env.local`
- Or the environment variable is not loaded

**Fix:**
1. Open `.env.local`
2. Replace `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name` 
3. With your actual Cloud Name: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dqhkjd7xz`
4. **Restart the dev server:** Stop (`Ctrl+C`) and run `npm run dev` again

#### ❌ Upload Failed with Specific Error
The error message will now show the actual Cloudinary error:
```
❌ Błąd podczas przesyłania zdjęcia: [specific error from Cloudinary]
```

**Common errors:**
- `Invalid preset` → Create the `cv_sushi_chef` preset (Step 3)
- `File too large` → Image must be under 5MB
- `Unauthorized` → Preset must be set to "Unsigned"

### Testing

After configuration, test the upload:
1. Go to `http://localhost:3000/academy/profile`
2. Click the camera icon on the avatar
3. Select an image (JPG, PNG, or WebP)
4. You should see:
   - ✅ Image preview with "Preview" badge
   - ✅ Upload in progress
   - ✅ Success: "Zdjęcie zostało pomyślnie przesłane!"

If it fails, check:
- Browser console for detailed error
- `.env.local` has correct cloud name
- Dev server was restarted after changing `.env.local`
- Upload preset `cv_sushi_chef` exists and is "Unsigned"

### Шаг 5: Перезапустите dev сервер

```bash
npm run dev
```

### Шаг 6: Протестируйте загрузку

1. Откройте http://localhost:3000/academy/profile
2. Нажмите на аватар или кнопку "Prześlij zdjęcie"
3. Выберите изображение (JPG, PNG, WEBP, макс 5MB)
4. Дождитесь успешной загрузки
5. Проверьте в Cloudinary Dashboard → Media Library, что файл появился

## 🔒 Безопасность

**Unsigned upload preset** безопасен для использования на фронтенде, так как:

- ✅ Ограничен размером файла (5MB)
- ✅ Ограничен форматами (только изображения)
- ✅ Автоматически применяет transformations
- ✅ Имеет rate limiting от Cloudinary

Для production рекомендуется:

1. Создать отдельный Upload Preset с подписью
2. Использовать backend API для генерации подписей
3. Настроить CORS restrictions в Cloudinary

## 📚 Дополнительные ресурсы

- [Cloudinary Upload Widget Documentation](https://cloudinary.com/documentation/upload_widget)
- [Unsigned Upload Documentation](https://cloudinary.com/documentation/upload_images#unsigned_upload)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

## ❓ Troubleshooting

### Ошибка "Upload failed"

- Проверьте, что Cloud Name указан правильно
- Убедитесь, что Upload Preset настроен как "Unsigned"
- Проверьте размер файла (должен быть < 5MB)
- Проверьте формат файла (JPG, PNG, WEBP)

### Изображение не отображается после загрузки

- Проверьте Network вкладку в DevTools
- Убедитесь, что URL изображения начинается с `https://res.cloudinary.com/`
- Проверьте, что в `next.config.ts` добавлен домен `res.cloudinary.com` в `images.remotePatterns`

### Добавьте Cloudinary domain в next.config.ts

Откройте `next.config.ts` и добавьте:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
      pathname: "/**",
    },
    // ... other patterns
  ],
}
```

Готово! 🎉
