export function clsx(...classes: (string | undefined | false)[]) {
  return classes.join(" ")
}

export function delay(milliseconds = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}
