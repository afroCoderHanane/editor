// import ImageEditor from '../components/ImageEditorv4';
import ImageEditor from '../components/ImageEditor';
export default function Home() {
  const imageURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Mike_Bloomberg_Headshot.jpg/1200px-Mike_Bloomberg_Headshot.jpg";
  return (
    <div>
      <h1>Image Editor</h1>
      <ImageEditor imageUrl={imageURL} />
    </div>
  );
}

