// Función para crear un marcador y manejar errores
function createBookmark(properties, callback) {
  chrome.bookmarks.create(properties, (newBookmark) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    callback(newBookmark);
  });
}

// Función para buscar o crear una carpeta
function findOrCreateFolder(parentId, folderTitle, callback) {
  chrome.bookmarks.search({ title: folderTitle }, (results) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    const existingFolder = results[0];
    if (!existingFolder) {
      createBookmark(
        {
          title: folderTitle,
          parentId: parentId,
        },
        (newFolder) => {
          callback(newFolder); // Llamada al callback con el nuevo folder creado
        }
      );
    } else {
      callback(existingFolder);
    }
  });
}

// Función para manejar el mensaje entrante desde el contenido de la página
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "saveComment") {
    const commentData = message.data;
    findOrCreateFolder("1", "PlatziComments", (platziCommentsFolder) => {
      findOrCreateFolder(
        platziCommentsFolder.id,
        `Course/ ${commentData.courseName}`,
        (courseFolder) => {
          findOrCreateFolder(
            courseFolder.id,
            `Class/ ${commentData.className}`,
            (classFolder) => {
              const properties = {
                title: commentData.commentName,
                url: commentData.commentLink,
                parentId: classFolder.id, // El bookmark se creará en el folder de la clase
              };
              createBookmark(properties, (newBookmark) => {});
            }
          );
        }
      );
    });

    sendResponse({
      status: "success",
      message: "✔ Comment saved in the extensio",
    });
  }
});
