const getPluralMessages = (count) => {
  if (count === 0) return '0 сообщений';
  if (count % 10 === 1 && count % 100 !== 11) return `${count} сообщение`;
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} сообщения`;
  }
  return `${count} сообщений`;
};

export default getPluralMessages;
