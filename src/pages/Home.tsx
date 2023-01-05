import React from 'react';
import { useSelector } from 'react-redux';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import { fetchPizzas, SearchPizzaParams, selectPizzaData } from '../redux/slices/pizzaSlice';
import {
  selectFilter,
  setCategoryId,
  setCurrentPage,
  setFilters,
} from '../redux/slices/filterSlice';
import Categories from '../components/Categories';
import Sort, { list } from '../components/Sort';
import { PizzaBlock } from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import { useAppDispatch } from '../redux/store';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = React.useRef(false);

  const { categoryId, sort, searchValue, currentPage } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  const onChangeCategory = React.useCallback((id: number) => {
    dispatch(setCategoryId(id));
  }, []);

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = async () => {
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sort.sortProperty.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );
    window.scrollTo(0, 0);
  };

  // React.useEffect(() => {
  // if (isMounted.current) {
  //   const params = {
  //     categoryId: categoryId > 0 ? categoryId : null,
  //     sortProperty: sort.sortProperty,
  //     currentPage,
  //   };

  //   const queryString = qs.stringify(params, { skipNulls: true });

  //   navigate(`/?${queryString}`);
  // }

  // const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
  // const sortObj = list.find((obj) => obj.sortProperty === params.sortBy);
  // dispatch(
  //   setFilters({
  //     searchValue: params.search,
  //     categoryId: Number(params.category),
  //     currentPage: Number(params.currentPage),
  //     sort: sortObj || list[0],
  //   }),
  // );
  // }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  React.useEffect(() => {
    getPizzas();
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  // React.useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
  //     const sort = list.find((obj) => obj.sortProperty === params.sortBy);
  //     dispatch(
  //       setFilters({
  //         searchValue: params.search,
  //         categoryId: Number(params.category),
  //         currentPage: Number(params.currentPage),
  //         sort: sort || list[0],
  //       }),
  //     );
  //   }
  //   isMounted.current = true;
  // }, []);

  const pizzas = items.map((obj: any) => <PizzaBlock {...obj} key={obj.id} />);
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже</p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
