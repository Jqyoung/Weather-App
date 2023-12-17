function createDomElement({ elementTag, className, textContent, attr }) {
  const element = document.createElement(elementTag);

  if (className) {
    const classNames = className.split(' ');
    classNames.forEach((name) => {
      element.classList.add(name);
    });
  }
  if (textContent) {
    element.textContent = textContent;
  }
  if (attr) {
    for (const [attrName, attrValue] of Object.entries(attr)) {
      element.setAttribute(attrName, attrValue);
    }
  }

  return element;
}

export { createDomElement };
