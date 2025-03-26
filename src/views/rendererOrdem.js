// function configurarPrevisualizacao(inputId, previewId) {
//     const inputFoto = document.getElementById(inputId);
//     const preview = document.getElementById(previewId);

//     inputFoto.addEventListener("change", function() {
//         const arquivos = this.files;
//         preview.innerHTML = ''; // Limpa a pré-visualização antes de adicionar novas imagens

//         for (let i = 0; i < arquivos.length; i++) {
//             const arquivo = arquivos[i];
//             const reader = new FileReader();

//             reader.onload = function(e) {
//                 const img = document.createElement("img");
//                 img.src = e.target.result;
//                 img.alt = "Pré-visualização";
//                 img.style.maxWidth = '50px';
//                 img.style.maxHeight = '50px';
//                 img.style.padding = '10px';
//                 img.style.objectFit = 'contain';
//                 preview.appendChild(img);
//             };
            
//             reader.readAsDataURL(arquivo);
//         }
//     });
// }

// function resetForm(formId, inputId, previewId) {
//     document.getElementById(formId).reset();
//     document.getElementById(previewId).innerHTML = '';  // Limpa a pré-visualização da imagem
//     document.getElementById(inputId).value = '';        // Limpa o campo de input de arquivo
// }

// document.addEventListener("DOMContentLoaded", function() {
//     configurarPrevisualizacao("foto", "preview");
// });
