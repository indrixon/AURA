// ─── CLOUDINARY – Upload d'image (unsigned) ──────────────────────────────────
// Pas besoin de backend. Cloudinary accepte les uploads directs depuis
// le navigateur via un "Upload Preset" non signé.
//
// ➤ CONFIGURATION (à faire une seule fois sur cloudinary.com) :
//   1. Créer un compte sur https://cloudinary.com (gratuit, 25 Go)
//   2. Dashboard → Settings → Upload → "Add upload preset"
//   3. Mettre "Signing Mode" sur "Unsigned"
//   4. Copier le nom du preset ci-dessous (CLOUDINARY_UPLOAD_PRESET)
//   5. Copier ton "Cloud name" depuis le Dashboard (CLOUDINARY_CLOUD_NAME)
// ─────────────────────────────────────────────────────────────────────────────

const CLOUDINARY_CLOUD_NAME   = "dvr3silxe";    // Ex: "aura-carson"
const CLOUDINARY_UPLOAD_PRESET = "AURA-BY"; // Ex: "aura_unsigned"

/**
 * Upload un fichier image vers Cloudinary.
 * @param {File} file - Le fichier image sélectionné par l'utilisateur
 * @param {Function} onProgress - Callback(percent) pour la barre de progression
 * @returns {Promise<string>} L'URL sécurisée de l'image hébergée
 */
export async function uploadImage(file, onProgress = null) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "aura-perfumes"); // Dossier organisationnel

  // XMLHttpRequest pour avoir la progression en temps réel
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        reject(new Error("Cloudinary upload échoué : " + xhr.statusText));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Erreur réseau Cloudinary")));

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}
