import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from 'assets/theme';
import themeDark from 'assets/theme-dark';

import logo from 'images/balance_logo.png';
import 'assets/css/nucleo-icons.css';
import 'assets/css/nucleo-svg.css';
import { useAppDispatch, useAppSelector } from 'types/global';
import * as urls from 'constants/urls';
import { LOGIN } from 'constants/urls';
import { setMiniSidenav } from 'redux/slices/uiSlice';
import routes, { SidebarLink } from 'routes';
import GlobalErrorSnackbar from 'our_components/GlobalErrorSnackbar';
import ErrorBoundary from 'components/ErrorBoundary';
import MainLoader from 'our_components/loader/MainLoader';
import { withFallbackBackdrop } from 'our_components/common/LoadingBackdrop';
import 'stylesheets/global.scss';
import TokenRefresher from 'components/TokenRefresher';

// Lazy import в React используется для динамической загрузки компонентов по требованию,
// улучшая производительность и сокращая время инициализации приложения.

const Configurator = lazy(() => import('examples/Configurator/Configurator'));
const LoginView = lazy(() => import('views/login/LoginView'));
const Sidenav = lazy(() => import('examples/Sidenav/Sidenav'));
const LayoutWrapper = lazy(() => import('our_components/common/LayoutWrapper'));

export default function App() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();

    const loggedIn = useAppSelector((state) => state.user.loggedIn);
    const { miniSidenav, layout, sidenavColor, darkMode } = useAppSelector((state) => state.ui);

    const [onMouseEnter, setOnMouseEnter] = useState(false);

    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            dispatch(setMiniSidenav(false));
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            dispatch(setMiniSidenav(true));
            setOnMouseEnter(false);
        }
    };

    //функция которая рендерит роуты, если есть внутренние срабатывает рекурсивно
    const getRoutes = (allRoutes: SidebarLink): any =>
        allRoutes.map((route, i) => {
            if (route.collapse) {
                return getRoutes(route.collapse);
            }
            if (route.route && route.component) {
                return (
                    <Route
                        path={route.route}
                        element={
                            <Suspense fallback={<MainLoader fullWidth left />}>
                                <LayoutWrapper>{withFallbackBackdrop(route.component)}</LayoutWrapper>
                            </Suspense>
                        }
                        key={i}
                    />
                );
            }
            return null;
        });

    useEffect(() => {
        if (!loggedIn) {
            navigate(LOGIN);
        }
    }, []);

    // Setting page scroll to 0 when changing the route
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        if (document.scrollingElement) {
            document.scrollingElement.scrollTop = 0;
        }
    }, [pathname]);
    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>

            {/*Error Boundary для обработки ошибок, которые возникают в компонентах ниже по иерархии. */}
            <ErrorBoundary>
                <TokenRefresher />
                <CssBaseline />
                <GlobalErrorSnackbar />
                {layout === 'dashboard' && (
                    <Suspense fallback={<MainLoader fullWidth left />}>
                        <Sidenav
                            color={sidenavColor}
                            brand={logo}
                            brandName="Balance Admin"
                            onMouseEnter={handleOnMouseEnter}
                            onMouseLeave={handleOnMouseLeave}
                            routes={routes}
                        />
                        <Configurator />
                    </Suspense>
                )}
                {layout === 'vr' && <Configurator />}
                <Suspense fallback={<MainLoader fullWidth left />}>
                    <Routes>
                        <Route
                            path={urls.LOGIN}
                            element={
                                <Suspense fallback={<MainLoader fullWidth />}>
                                    <LoginView />
                                </Suspense>
                            }
                        />
                        {getRoutes(routes).filter(Boolean)}
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </ThemeProvider>
    );
}
