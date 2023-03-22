import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from 'components/Searchbar/Searchbar';
import Modal from 'components/Modal/Modal';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import Loader from 'components/Loader/Loader';
import fetchPhoto from 'services/Api';
import 'style.css';

export default function App() {
  const [searchingQuery, setSearchingQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shoowModal, setShoowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [tag, setTag] = useState(null);

  useEffect(() => {
    if (!searchingQuery) {
      return;
    }
    async function fetchingPhotos() {
      try {
        setIsNextPage(false);
        setIsLoading(true);
        const { hits, isTheNextPage } = await fetchPhoto(searchingQuery, page);
        setImages(pS => [...pS, ...hits]);
        setIsNextPage(isTheNextPage);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.message + 'Try again!');
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
        {images && (
          <>
            <ImageGallery images={images} onClick={handleOpendModal} />
            {isNextPage && <Button onClick={handleButtonClick} />}
          </>
        )}
        {isLoading && <Loader />}
      </>
    </div>
  );
}
