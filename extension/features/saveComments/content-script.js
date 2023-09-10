/* The above code is a JavaScript function that enables the functionality to save comments in a web
application. It adds a custom button to each comment or contribution in the application, allowing
users to save the comment for later reference. When the button is clicked, a modal window is
displayed where the user can enter a title for the saved comment. The comment data, including the
course name, class name, comment name, author name, and comment link, is then sent to the backend
for saving. The code also includes localization for translating the UI elements and handles
different scenarios for adding the custom button and modal based on */

// Obtaining the state of the "enableSaveComment" option from Chrome synchronization
chrome.storage.sync.get(["enableSaveComment"], ({ enableSaveComment }) => {
  if (enableSaveComment) {
    // Load styles from a CSS file
    const cssUrl = chrome.runtime.getURL(
      "./features/saveComments/saveComments.css"
    );
    injectCss(cssUrl, "head");

    // Localization keys for translations
    const TR_KEYS = {
      saveCommentButton: "saveCommentButton",
      notificationModalTitle: "notificationModalTitle",
      notificationModalSub: "notificationModalSub",
      modalHeaderTitle: "modalHeaderTitle",
      formInputTitle: "formInputTitle",
      saveCommentModalButtonDiscard: "saveCommentModalButtonDiscard",
      saveCommentModalButtonSave: "saveCommentModalButtonSave",
      formInputTitleError: "formInputTitleError",
    };

    // Get translated messages
    const TR_MESSAGES = {
      saveCommentButton: chrome.i18n.getMessage(TR_KEYS.saveCommentButton),
      notificationModalTitle: chrome.i18n.getMessage(
        TR_KEYS.notificationModalTitle
      ),
      notificationModalSub: chrome.i18n.getMessage(
        TR_KEYS.notificationModalSub
      ),
      modalHeaderTitle: chrome.i18n.getMessage(TR_KEYS.modalHeaderTitle),
      formInputTitle: chrome.i18n.getMessage(TR_KEYS.formInputTitle),
      saveCommentModalButtonDiscard: chrome.i18n.getMessage(
        TR_KEYS.saveCommentModalButtonDiscard
      ),
      saveCommentModalButtonSave: chrome.i18n.getMessage(
        TR_KEYS.saveCommentModalButtonSave
      ),
      formInputTitleError: chrome.i18n.getMessage(TR_KEYS.formInputTitleError),
    };

    // Get the absolute URL of the SVG file
    const svgIconSave = `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bookmark" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"></path>
    </svg>
  `;

    // Function to create a custom button with an icon based on the URL
    function createCustomButton(className) {
      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("save-comment-button");
      button.classList.add(className);
      button.setAttribute("aria-label", TR_MESSAGES.saveCommentButton);
      button.setAttribute("title", TR_MESSAGES.saveCommentButton);
      button.style.opacity = "0";
      button.innerHTML = svgIconSave;
      return button;
    }

    // Function to create the successful notification
    function createSuccessfulNotification() {
      const confirmationModal = document.createElement("div");
      confirmationModal.classList.add("notification-modal-content");
      confirmationModal.innerHTML = /*html*/ `
    <div class="notification-modal-header">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-folder-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M11 19h-6a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v4"></path>
        <path d="M15 19l2 2l4 -4"></path>
      </svg>
      <span class="notification-modal-title">${TR_MESSAGES.notificationModalTitle}</span>
    </div>
    <span class="notification-modal__sub">
    ${TR_MESSAGES.notificationModalSub}</span>`;
      return confirmationModal;
    }

    // Function to create the custom modal
    function createCustomModal() {
      const modal = document.createElement("div");
      modal.classList.add("save-comment-modal");
      modal.innerHTML = /*html*/ `
    <div class="save-comment-modal-content">
      <div class="modal-header">
        <h4 class="modal-header__title">${TR_MESSAGES.modalHeaderTitle}</h4>
      </div>
      <form class="save-comment-modal-form">
        <div class="modal-form-body">
          <div class="form-group">
            <input type="text" class="form-input-title" id="commentInputTitle" placeholder="${TR_MESSAGES.formInputTitle}">
          </div>
          <span class="form-input-title-error"></span>
          <div class="save-comment-modal-buttons">
            <button type="button" class="save-comment-modal-button save-comment-modal-button__discard">${TR_MESSAGES.saveCommentModalButtonDiscard}</button>
            <button type="button" class="save-comment-modal-button save-comment-modal-button__save">${TR_MESSAGES.saveCommentModalButtonSave}</button>
          </div>
        </div>
      </form>
    </div>`;
      return modal;
    }

    // Function to add the custom modal
    function addCustomModal({ commentData = {} }) {
      const body = document.querySelector("body");
      const customModal = createCustomModal();
      const succefullNotification = createSuccessfulNotification();
      body.appendChild(customModal);

      const commentInputTitle = customModal.querySelector("#commentInputTitle");
      const saveCommentButton = customModal.querySelector(
        ".save-comment-modal-button.save-comment-modal-button__save"
      );
      const discardCommentButton = customModal.querySelector(
        ".save-comment-modal-button.save-comment-modal-button__discard"
      );
      const commentInputTitleError = customModal.querySelector(
        ".form-input-title-error"
      );

      const commentNameTmp = commentData.commentName;

      commentInputTitle.value = commentNameTmp || "";

      saveCommentButton.addEventListener("click", () => {
        if (commentInputTitle.value.length > 0) {
          commentData.commentName = commentInputTitle.value;

          chrome.runtime.sendMessage({
            type: "saveComment",
            data: commentData,
          });
          customModal.remove();
          body.appendChild(succefullNotification);
          setTimeout(() => {
            succefullNotification.remove();
          }, 2000);

          commentData.commentName = commentNameTmp;
        } else {
          commentInputTitleError.textContent = TR_MESSAGES.formInputTitleError;
          commentInputTitleError.classList.add(
            "form-input-title-error__active"
          );
        }
      });

      discardCommentButton.addEventListener("click", () => {
        customModal.remove();
      });
    }

    //Get current path of the page
    let currentPath = window.location.pathname;

    //Add function to save comments in the path /clases/
    if (currentPath.startsWith("/clases/")) {
      let observer = null;

      function observeChanges(targetNode) {
        if (!targetNode) {
          console.error("❌ target element not found!");
          return;
        }

        const parents = targetNode.querySelectorAll(".Content-author");
        parents.forEach((parent) => {
          if (!parent.querySelector(".save-comment-button")) {
            addCustomButton(parent);
          }
        });

        observer = new MutationObserver((mutationsList, observer) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              const parents = targetNode.querySelectorAll(".Content-author");
              parents.forEach((parent) => {
                if (!parent.querySelector(".save-comment-button")) {
                  addCustomButton(parent);
                }
              });
            }
          }
        });

        observer.observe(targetNode, { childList: true, subtree: true });
      }

      function stopObserving() {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }

      function checkAndObserve() {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/clases/")) {
          const targetNode = document.querySelector(
            ".CommunityTabs-content-content"
          );
          stopObserving();
          observeChanges(targetNode);
        } else {
          stopObserving();
        }
      }

      checkAndObserve();

      window.addEventListener("popstate", () => {
        checkAndObserve();
      });

      function getDataComment(customButton) {
        const courseInfo = document.querySelector(
          ".Header-course-info-content"
        );
        const linkWithinCourse = courseInfo.querySelector("a");
        const courseName = linkWithinCourse.querySelector("h2").textContent;

        const classContentTitle = document.querySelector(".Header-class-title");
        const className = classContentTitle.querySelector("h1").textContent;

        const commentInfoContainer = customButton.previousElementSibling;
        const commentAuthor =
          commentInfoContainer.querySelector("p").textContent;
        const commentLink = commentInfoContainer.querySelector("a").href;

        const parentElement = customButton.parentNode.parentNode;
        const contentBodyComment = parentElement.querySelector(".Content-body");
        const contentBodyTextComment = contentBodyComment.querySelector(
          ".ContentMardown-text.Content-body-text"
        );
        const contentBodyTextCommentFirstChild =
          contentBodyTextComment.firstChild.textContent;

        return {
          courseName: courseName,
          courseLink: linkWithinCourse.href,
          className: className,
          commentName: contentBodyTextCommentFirstChild,
          commentAuthor: commentAuthor,
          commentLink: commentLink,
        };
      }

      function addCustomButton(parent) {
        const customButton = createCustomButton("save-comment-button__class");
        parent.appendChild(customButton);

        const commentData = getDataComment(customButton);
        customButton.addEventListener("click", () => {
          addCustomModal({ commentData });
        });
      }
    }

    //Add function to save comments in the path /comentario/
    if (currentPath.startsWith("/comentario/")) {
      function getDataComment({ type = "contribution", parent = "" }) {
        const parentCourseInfo = document.querySelector(
          ".MainContribution-related-text"
        );
        const course = parentCourseInfo.firstElementChild;
        const className = parentCourseInfo.lastElementChild.textContent;

        if (type === "contribution") {
          const contentBodyText = document.querySelector(
            ".MainContribution-text"
          );
          const commentName = contentBodyText.firstChild.textContent;

          const contentBodyAuthor = document.querySelector(
            ".MainContribution-user"
          );
          const authorName = contentBodyAuthor.querySelector("a").textContent;

          return {
            courseName: course.textContent,
            courseLink: course.href,
            className: className,
            commentName: commentName,
            commentAuthor: authorName,
            commentLink: window.location.href,
          };
        }

        if (type === "comment") {
          const contentBodyText = parent.querySelector(".CommentContent-text");
          const commentName = contentBodyText.firstChild.textContent;

          const contentBodyAuthor = parent.querySelector(".CommentAuthor");
          const authorName = contentBodyAuthor.querySelector("a").textContent;

          return {
            courseName: course.textContent,
            courseLink: course.href,
            className: className,
            commentName: commentName,
            commentAuthor: authorName,
            commentLink: window.location.href,
          };
        }

        return {
          courseName: "",
          courseLink: "",
          className: "",
          commentName: "",
          commentAuthor: "",
          commentLink: "",
        };
      }

      const parentContribution = document.querySelector(
        ".MainContribution-like"
      );
      if (
        parentContribution.classList.contains("MainContribution-like") &&
        !parentContribution.querySelector(".save-comment-button")
      ) {
        const commentData = getDataComment({ type: "contribution" });
        addCustomButton(parentContribution, commentData);
      }

      const parentComment = document.querySelector(".CommentList");
      if (parentComment.classList.contains("CommentList")) {
        const parentComments = parentComment.querySelectorAll(".Comment");
        parentComments.forEach((parent) => {
          if (!parent.querySelector(".save-comment-button")) {
            const commentData = getDataComment({ type: "comment", parent });
            addCustomButton(parent, commentData);
          }
        });
      }

      function addCustomButton(parent, commentData) {
        const customButton = createCustomButton("save-comment-button__comment");
        parent.insertBefore(customButton, parent.children[1]);

        customButton.addEventListener("click", () => {
          addCustomModal({ commentData });
        });
      }
    }
  }
});
