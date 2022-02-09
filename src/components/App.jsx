import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from 'components/Searchbar/Searchbar';
import Modal from 'components/Modal/Modal';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import Text from 'components/Text/Text';
import Loader from 'components/Loader/Loader';
import fetchPhoto from 'services/Api';
import 'style.css';

export default function App() {
  const per_page = 12;

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isNextPage, setIsNextPage] = useState(false);
  const [status, setStatus] = useState('idle');
  const [shoowModal, setShoowModal] = useState(false);
  const [searchingQuery, setSearchingQuery] = useState('');
  const [url, setUrl] = useState('');
  const [tag, setTag] = useState(null);

  useEffect(() => {
    if (!searchingQuery) {
      return;
    }
    async function fetchingPhotos() {
      setStatus('pending');
      try {
        const { hits, isTheNextPage } = await fetchPhoto(
          searchingQuery,
          page,
          per_page
        );
        setImages(pS => [...pS, ...hits]);
        setIsNextPage(isTheNextPage);
        setStatus('resolved');

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      } catch (error) {
        setError(error);
        setStatus('rejected');
      }
    }
    fetchingPhotos();
  }, [searchingQuery, page]);

  const handleSubmit = trimQuery => {
    setImages([]);
    setSearchingQuery(trimQuery);
    setPage(1);
  };

  const handleButtonClick = () => {
    setPage(pS => pS + 1);
  };

  const handleOpendModal = e => {
    if (e.target.className !== 'imageGalleryItem-image') {
      return;
    }
    const largeUrl = e.target.attributes.url.value;
    setUrl(largeUrl);
    setTag(e.target.alt);
    handleTogleModal();
  };
  const handleTogleModal = () => {
    setShoowModal(pS => !pS);
  };
  return (
    <div className="app">
      <Searchbar onSubmit={handleSubmit} />
      <ToastContainer autoClose={3000} icon={false}></ToastContainer>
      {shoowModal && (
        <Modal onClose={handleTogleModal}>
          <img src={url} alt={tag} />
        </Modal>
      )}
      <>
        {status === 'idle' && <Text>Enter samething to find.</Text>}
        {status === 'pending' && <Loader />}
        {status === 'rejected' && <Text>{error.message}</Text>}
        {status === 'resolved' && (
          <>
            <ImageGallery images={images} onClick={handleOpendModal} />
            {isNextPage ? (
              <Button onClick={handleButtonClick} />
            ) : (
              <Text>There is no more photo.</Text>
            )}
          </>
        )}
      </>
      {/* <ImagesView
        searchingQuery={searchingQuery}
        onClick={handleModalClick}
        togleModal={handleTogleModal
      /> */}
    </div>
  );
}
