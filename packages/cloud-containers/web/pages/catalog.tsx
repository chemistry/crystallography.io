import { client } from '../services/apollo-client';
import { gql } from '@apollo/client';


const GET_STRUCTURES = gql`
  query getStructuresByPages($page: Int!) {
    structures(page: $page) {
      _id,
      a
    }
  }
`;

const CatalogPage = ({data}: any) => {
  return (
      <div>
          <header className="app-layout-header">
              <h2 className="text-primary">Catalog</h2>
          </header>
          <div className="app-layout-content">
              <div className="app-layout-page-transparent">{JSON.stringify(data)} </div>
          </div>
      </div>
  );
};

export async function getStaticProps() {
  const { data } = await client.query({
    query: GET_STRUCTURES,
    variables: { page: 1 }
  });

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data },
  }
}

export default CatalogPage;
