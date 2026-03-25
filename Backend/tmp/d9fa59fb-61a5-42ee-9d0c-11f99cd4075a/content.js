
document.querySelectorAll('img').forEach(img => {
  const div = document.createElement('div');
  div.style.width = img.width + 'px';
  div.style.height = img.height + 'px';
  div.style.background = 'red';
  img.replaceWith(div);
});
      