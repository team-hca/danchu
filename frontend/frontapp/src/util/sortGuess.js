const sortGuess = (key) => {
  // localStorage에서 데이터 가져오기
  const dataString = localStorage.getItem(key);
  if (!dataString) {
    console.error(`No data found in localStorage for key: ${key}`);
    return;
  }
  const data = JSON.parse(dataString);

  const sortBySimilarity = (sectionArray) => {
    // 배열을 similarity로 정렬
    return sectionArray.sort((a, b) => b.similarity - a.similarity);
  };

  const sortedData = {
    guessTop1000: sortBySimilarity(data.guessTop1000),
    guessOthers: sortBySimilarity(data.guessOthers),
  };

  // 정렬된 데이터를 다시 localStorage에 저장
  localStorage.setItem(key, JSON.stringify(sortedData));

  // 변경된 데이터 출력
  console.log("Sorted data:", sortedData);

  return "OK";
};

export default sortGuess;
