--
-- PostgreSQL database dump
--

\restrict YLPjmzbG8hgn8aQ09B5AtYg9tD6m1kkJGPvurivglhL9fi0FXrGS3A9jM82NxHu

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-24 19:02:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 57382)
-- Name: empleados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleados (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    cargo character varying(80)
);


ALTER TABLE public.empleados OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 57381)
-- Name: empleados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empleados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empleados_id_seq OWNER TO postgres;

--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 219
-- Name: empleados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empleados_id_seq OWNED BY public.empleados.id;


--
-- TOC entry 222 (class 1259 OID 57391)
-- Name: produccion_leche; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produccion_leche (
    id integer NOT NULL,
    fecha date NOT NULL,
    turno character varying(20) NOT NULL,
    cantidad_litros numeric(8,2) NOT NULL,
    empleado_id integer NOT NULL,
    estado character varying(20) DEFAULT 'Registrado'::character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT produccion_leche_cantidad_litros_check CHECK ((cantidad_litros > (0)::numeric)),
    CONSTRAINT produccion_leche_estado_check CHECK (((estado)::text = ANY ((ARRAY['Registrado'::character varying, 'Verificado'::character varying, 'Anulado'::character varying])::text[]))),
    CONSTRAINT produccion_leche_turno_check CHECK (((turno)::text = ANY ((ARRAY['Mañana'::character varying, 'Tarde'::character varying])::text[])))
);


ALTER TABLE public.produccion_leche OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 57390)
-- Name: produccion_leche_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produccion_leche_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produccion_leche_id_seq OWNER TO postgres;

--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 221
-- Name: produccion_leche_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produccion_leche_id_seq OWNED BY public.produccion_leche.id;


--
-- TOC entry 4814 (class 2604 OID 57385)
-- Name: empleados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados ALTER COLUMN id SET DEFAULT nextval('public.empleados_id_seq'::regclass);


--
-- TOC entry 4815 (class 2604 OID 57394)
-- Name: produccion_leche id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produccion_leche ALTER COLUMN id SET DEFAULT nextval('public.produccion_leche_id_seq'::regclass);


--
-- TOC entry 4976 (class 0 OID 57382)
-- Dependencies: 220
-- Data for Name: empleados; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.empleados VALUES (1, 'José Ureña', 'Jefe de ordeño');
INSERT INTO public.empleados VALUES (2, 'Miguel Féliz', 'Encargado de potreros');
INSERT INTO public.empleados VALUES (3, 'Yolanda Peña', 'Médica veterinaria');
INSERT INTO public.empleados VALUES (4, 'JosÃ© UreÃ±a', 'Jefe de ordeÃ±o');
INSERT INTO public.empleados VALUES (5, 'Miguel FÃ©liz', 'Encargado de potreros');
INSERT INTO public.empleados VALUES (6, 'Yolanda PeÃ±a', 'MÃ©dica veterinaria');


--
-- TOC entry 4978 (class 0 OID 57391)
-- Dependencies: 222
-- Data for Name: produccion_leche; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.produccion_leche VALUES (1, '2026-07-14', 'Mañana', 320.50, 1, 'Verificado', '2026-07-20 18:19:15.739527');
INSERT INTO public.produccion_leche VALUES (2, '2026-07-14', 'Tarde', 280.00, 1, 'Verificado', '2026-07-20 18:19:15.739527');
INSERT INTO public.produccion_leche VALUES (3, '2026-07-15', 'Mañana', 310.75, 2, 'Registrado', '2026-07-20 18:19:15.739527');
INSERT INTO public.produccion_leche VALUES (4, '2026-07-16', 'Mañana', 305.00, 1, 'Registrado', '2026-07-20 18:19:15.739527');
INSERT INTO public.produccion_leche VALUES (5, '2026-07-16', 'Tarde', 275.25, 2, 'Anulado', '2026-07-20 18:19:15.739527');
INSERT INTO public.produccion_leche VALUES (7, '2026-07-20', 'Tarde', 150.00, 4, 'Verificado', '2026-07-20 18:39:12.41645');


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 219
-- Name: empleados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empleados_id_seq', 6, true);


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 221
-- Name: produccion_leche_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produccion_leche_id_seq', 7, true);


--
-- TOC entry 4822 (class 2606 OID 57389)
-- Name: empleados empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_pkey PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 57408)
-- Name: produccion_leche produccion_leche_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produccion_leche
    ADD CONSTRAINT produccion_leche_pkey PRIMARY KEY (id);


--
-- TOC entry 4823 (class 1259 OID 57415)
-- Name: idx_produccion_empleado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_produccion_empleado ON public.produccion_leche USING btree (empleado_id);


--
-- TOC entry 4824 (class 1259 OID 57414)
-- Name: idx_produccion_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_produccion_fecha ON public.produccion_leche USING btree (fecha);


--
-- TOC entry 4827 (class 2606 OID 57409)
-- Name: produccion_leche produccion_leche_empleado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produccion_leche
    ADD CONSTRAINT produccion_leche_empleado_id_fkey FOREIGN KEY (empleado_id) REFERENCES public.empleados(id) ON DELETE RESTRICT;


-- Completed on 2026-07-24 19:02:21

--
-- PostgreSQL database dump complete
--

\unrestrict YLPjmzbG8hgn8aQ09B5AtYg9tD6m1kkJGPvurivglhL9fi0FXrGS3A9jM82NxHu

