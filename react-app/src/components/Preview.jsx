import './Preview.css';


function Preview({ link }) {

    const favicon = (/^http/).test(link.favicon) ? link.favicon :  link.url + link.favicon;
    const image = (/^http/).test(link.image) ? link.image :  link.url + link.image;

    return (
        <div className="Preview-container">
            <div>
                <img src={image} alt='img' />
            </div>
            <div>
                <div>
                    <img src={favicon} alt='favicon' />
                    <a href={ link.url } target='_blank' rel='noreferrer'>{ link.title }</a>
                </div>
                <p>
                    { link.description }
                </p>
            </div>
        </div>
    );
}

export default Preview;