// import layout from '../components/layout';
import Layout from '../components/layout';
import { ChapterComponent } from '../components/chapter';

const testClick = () => {
  alert('tesasdft');
};

export default function About() {
  return <h1 onClick={testClick}>tesasdft</h1>;
}
