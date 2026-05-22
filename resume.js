const resumeDownload = document.querySelector(".resume-download");

resumeDownload?.addEventListener("click", async (event) => {
  const resumePath = resumeDownload.getAttribute("href");
  const fileName = resumeDownload.getAttribute("download") || "resume.pdf";

  if (!resumePath) {
    return;
  }

  event.preventDefault();

  try {
    const response = await fetch(resumePath);

    if (!response.ok) {
      throw new Error("Resume download failed.");
    }

    const resumeBlob = await response.blob();
    const resumeUrl = URL.createObjectURL(resumeBlob);
    const temporaryLink = document.createElement("a");

    temporaryLink.href = resumeUrl;
    temporaryLink.download = fileName;
    temporaryLink.style.display = "none";
    document.body.appendChild(temporaryLink);
    temporaryLink.click();
    temporaryLink.remove();
    URL.revokeObjectURL(resumeUrl);
  } catch {
    window.location.href = resumePath;
  }
});
