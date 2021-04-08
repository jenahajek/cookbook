const markMatch = (source, query) => {
  const normalizedSource = source
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const regex = new RegExp(
    query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
    "i"
  );

  const index = normalizedSource.match(regex);
  let result;
  if (index !== null) {
    result = source.split("");
    result.splice(index.index, 0, "<mark>");
    result.splice(index.index + query.length + 1, 0, "</mark>");
    result = result.join("");
  }

  return result;
};

export default markMatch;
