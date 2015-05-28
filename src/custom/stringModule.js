app.value('string',
  {
    slugify: function(text) {
      if (!text) return '';
      text = _.deburr(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/ig, '_')
      ;
      return text;
    }
  }
);