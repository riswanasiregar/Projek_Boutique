import ErrorPage from '../../components/ErrorPage';

export default function Error400() {
  return (
    <ErrorPage
      code={400}
      title="Bad Request"
      description="Permintaan tidak valid. Periksa kembali data yang Anda kirimkan."
    />
  );
}
