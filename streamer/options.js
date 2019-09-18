function querySelectorAll(selector, element) {
  element = element || document;
  return Array.prototype.slice.call(element.querySelectorAll(selector));
}

var elements_ids = querySelectorAll("input, select").map(function(item) {
  return item.id;
});

var loading = document.getElementById("loading");

elements_ids.forEach(function(id) {
  if (!window.localStorage.getItem(id)) return;

  var element = document.getElementById(id);
  if (window.localStorage.getItem(id)) {
    if (element.type === "checkbox") {
      element.checked = window.localStorage.getItem(id) === "true";
    } else {
      element.value = window.localStorage.getItem(id);
    }
  } else {
    var item = {};
    item[element.id] =
      element.type === "checkbox"
        ? element.checked === true
          ? "true"
          : "false"
        : element.value;

    window.localStorage.setItem(
      Object.keys(item)[0],
      item[Object.keys(item)[0]]
    );
  }
});
setTimeout(function() {
  loading.setAttribute("hidden", "");
}, 600);

elements_ids.forEach(function(id) {
  var element = document.getElementById(id);
  element.onchange = function(e) {
    e && e.stopPropagation();
    element.disabled = true;

    loading.querySelector("span").innerHTML = "Saving changes";
    loading.removeAttribute("hidden");

    var item = {};
    item[element.id] =
      element.type === "checkbox"
        ? element.checked === true
          ? "true"
          : "false"
        : element.value;

    window.localStorage.setItem(
      Object.keys(item)[0],
      item[Object.keys(item)[0]]
    );
    element.disabled = false;
    setTimeout(function() {
      loading.setAttribute("hidden", "");
    }, 600);
  };

  if (element.type) {
    element.parentNode.onclick = function() {
      if (element.type !== "checkbox") {
        element.focus();
      } else {
        element.checked = !element.checked;
      }
    };

    element.onclick = element.onfocus = function(e) {
      e && e.stopPropagation();
    };
  }
});
