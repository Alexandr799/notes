import _parseDate from "date-fns/parseISO";
import _formatDate from "date-fns/format";

import regexparam from "regexparam";

// routing

export const routePatterns = {
  new: "/new",
  edit: "/:id/edit",
  view: "/:id",
};

export const routerPrefix = "/note";

const routeRegexes = Object.keys(routePatterns).reduce((acc, p) => {
  acc[p] = regexparam(routePatterns[p]);
  return acc;
}, {});

const matchPattern = (path, { keys, pattern }) => {
  const matches = pattern.exec(path);

  if (!matches) {
    return;
  }

  let i = 0;
  const params = {};

  while (i < keys.length) {
    params[keys[i]] = matches[++i] || null;
  }

  return params;
};

export const getActiveNoteId = ($location) => {
  const loc = $location.replace(new RegExp("^" + routerPrefix), "");

  for (const p of [routeRegexes.view, routeRegexes.edit]) {
    const m = matchPattern(loc, p);
    if (m && m.id) {
      return m.id;
    }
  }
  return null;
};

// data formatting

export const formatDate = (date) => {
  if (!date) {
    return "";
  }
  const d = _parseDate(date);
  return _formatDate(d, "dd.MM.yyyy");
};

export const formatSearchResult = (e) => {
  const hl = e.highlights;
  if (!hl) {
    return e.title;
  }
  return hl.replace(/<mark>/g, "<strong>").replace(/<\/mark>/g, "</strong>");
};
