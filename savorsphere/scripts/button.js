document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("animatedButton")

  button.addEventListener("mousedown", (e) => {
    e.preventDefault() // Prevent default action of the link
    button.classList.add("pressed")
  })

  button.addEventListener("mouseup", () => {
    button.classList.remove("pressed")
  })

  button.addEventListener("mouseleave", () => {
    button.classList.remove("pressed")
  })

  // Handle keyboard interactions
  button.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault() // Prevent default action of the link
      button.classList.add("pressed")
    }
  })

  button.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      button.classList.remove("pressed")
      button.click() // Programmatically click the link
    }
  })
})
