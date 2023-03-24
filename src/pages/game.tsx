
function Home({data}){
    return(
        <div>
            <h1>{data.title}</h1>
            <img src={data.url}></img>
        </div>
    )
}

export async function getServerSideProps() {

        var title
        var url
        await fetch('https://www.reddit.com/r/notdisneyvacation/random.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {

            title = myJson[0].data.children[0].data.title
            url = myJson[0].data.children[0].data.url
        });
  
        const data = { title, url }
        console.log(data)
    // Pass data to the page via props
    return { props: { data } }
  }

export default Home