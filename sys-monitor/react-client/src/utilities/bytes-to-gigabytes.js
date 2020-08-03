function bytesToGigabytes(bytes) {
  return Math.floor((bytes / 1073741824) * 100) / 100;
}

export default bytesToGigabytes;
