export function fetcher<T>(url: string): Promise<T> {
  return fetch(url).then((res) => res.json());
}
