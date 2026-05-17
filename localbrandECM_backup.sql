--
-- PostgreSQL database dump
--

\restrict N4uIbtHPJq7MjMlhzJ8oh6VgpGJMOzaZFxdZ3RKOGUAnc9hqje2882RajVSorYv

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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
-- Name: chitietdonhang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chitietdonhang (
    ma_chi_tiet_don_hang integer NOT NULL,
    ma_don_hang integer,
    ma_san_pham integer,
    so_luong integer,
    gia numeric(38,2),
    CONSTRAINT chitietdonhang_gia_check CHECK ((gia >= (0)::numeric)),
    CONSTRAINT chitietdonhang_so_luong_check CHECK ((so_luong > 0))
);


ALTER TABLE public.chitietdonhang OWNER TO postgres;

--
-- Name: chitietdonhang_ma_chi_tiet_don_hang_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chitietdonhang_ma_chi_tiet_don_hang_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chitietdonhang_ma_chi_tiet_don_hang_seq OWNER TO postgres;

--
-- Name: chitietdonhang_ma_chi_tiet_don_hang_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chitietdonhang_ma_chi_tiet_don_hang_seq OWNED BY public.chitietdonhang.ma_chi_tiet_don_hang;


--
-- Name: chitietgiohang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chitietgiohang (
    ma_gio_hang integer NOT NULL,
    ma_san_pham integer NOT NULL,
    so_luong integer,
    CONSTRAINT chitietgiohang_so_luong_check CHECK ((so_luong > 0))
);


ALTER TABLE public.chitietgiohang OWNER TO postgres;

--
-- Name: danhgia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.danhgia (
    ma_danh_gia integer NOT NULL,
    ma_nguoi_dung integer,
    ma_san_pham integer,
    so_sao integer,
    binh_luan character varying(500),
    ngay_danh_gia timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    trang_thai character varying(50) DEFAULT 'Hiển thị'::character varying,
    CONSTRAINT danhgia_so_sao_check CHECK (((so_sao >= 1) AND (so_sao <= 5)))
);


ALTER TABLE public.danhgia OWNER TO postgres;

--
-- Name: danhgia_ma_danh_gia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.danhgia_ma_danh_gia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.danhgia_ma_danh_gia_seq OWNER TO postgres;

--
-- Name: danhgia_ma_danh_gia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.danhgia_ma_danh_gia_seq OWNED BY public.danhgia.ma_danh_gia;


--
-- Name: danhmuc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.danhmuc (
    ma_danh_muc integer NOT NULL,
    ten_danh_muc character varying(100)
);


ALTER TABLE public.danhmuc OWNER TO postgres;

--
-- Name: danhmuc_ma_danh_muc_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.danhmuc_ma_danh_muc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.danhmuc_ma_danh_muc_seq OWNER TO postgres;

--
-- Name: danhmuc_ma_danh_muc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.danhmuc_ma_danh_muc_seq OWNED BY public.danhmuc.ma_danh_muc;


--
-- Name: donhang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.donhang (
    ma_don_hang integer NOT NULL,
    ma_nguoi_dung integer,
    ngay_dat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    trang_thai character varying(50),
    phuong_thuc_thanh_toan character varying(50),
    tong_tien numeric(38,2),
    phi_van_chuyen numeric(10,2) DEFAULT 0,
    ma_giam_gia integer,
    tien_giam numeric(10,2) DEFAULT 0,
    CONSTRAINT donhang_phi_van_chuyen_check CHECK ((phi_van_chuyen >= (0)::numeric)),
    CONSTRAINT donhang_tien_giam_check CHECK ((tien_giam >= (0)::numeric)),
    CONSTRAINT donhang_tong_tien_check CHECK ((tong_tien >= (0)::numeric))
);


ALTER TABLE public.donhang OWNER TO postgres;

--
-- Name: donhang_ma_don_hang_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.donhang_ma_don_hang_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.donhang_ma_don_hang_seq OWNER TO postgres;

--
-- Name: donhang_ma_don_hang_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.donhang_ma_don_hang_seq OWNED BY public.donhang.ma_don_hang;


--
-- Name: giohang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.giohang (
    ma_gio_hang integer NOT NULL,
    ma_nguoi_dung integer
);


ALTER TABLE public.giohang OWNER TO postgres;

--
-- Name: giohang_ma_gio_hang_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.giohang_ma_gio_hang_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.giohang_ma_gio_hang_seq OWNER TO postgres;

--
-- Name: giohang_ma_gio_hang_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.giohang_ma_gio_hang_seq OWNED BY public.giohang.ma_gio_hang;


--
-- Name: lienhe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lienhe (
    ma_lien_he integer NOT NULL,
    ma_nguoi_dung integer,
    noi_dung character varying(255),
    phan_hoi character varying(255),
    trang_thai character varying(50)
);


ALTER TABLE public.lienhe OWNER TO postgres;

--
-- Name: lienhe_ma_lien_he_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lienhe_ma_lien_he_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lienhe_ma_lien_he_seq OWNER TO postgres;

--
-- Name: lienhe_ma_lien_he_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lienhe_ma_lien_he_seq OWNED BY public.lienhe.ma_lien_he;


--
-- Name: magiamgia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.magiamgia (
    ma_giam_gia integer NOT NULL,
    ma_code character varying(50) NOT NULL,
    ten_chuong_trinh character varying(100),
    loai_giam character varying(20) NOT NULL,
    gia_tri_giam numeric(38,2),
    gia_tri_don_hang_toi_thieu numeric(10,2) DEFAULT 0,
    giam_toi_da numeric(38,2),
    so_luong integer DEFAULT 0,
    ngay_bat_dau timestamp without time zone NOT NULL,
    ngay_ket_thuc timestamp without time zone NOT NULL,
    trang_thai boolean DEFAULT true,
    CONSTRAINT magiamgia_check CHECK ((ngay_ket_thuc >= ngay_bat_dau)),
    CONSTRAINT magiamgia_gia_tri_giam_check CHECK ((gia_tri_giam >= (0)::numeric)),
    CONSTRAINT magiamgia_loai_giam_check CHECK (((loai_giam)::text = ANY ((ARRAY['PhanTram'::character varying, 'TienMat'::character varying])::text[]))),
    CONSTRAINT magiamgia_so_luong_check CHECK ((so_luong >= 0))
);


ALTER TABLE public.magiamgia OWNER TO postgres;

--
-- Name: magiamgia_ma_giam_gia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.magiamgia_ma_giam_gia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.magiamgia_ma_giam_gia_seq OWNER TO postgres;

--
-- Name: magiamgia_ma_giam_gia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.magiamgia_ma_giam_gia_seq OWNED BY public.magiamgia.ma_giam_gia;


--
-- Name: nguoidung; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nguoidung (
    ma_nguoi_dung integer NOT NULL,
    ten_dang_nhap character varying(50),
    mat_khau character varying(255),
    email character varying(100),
    so_dien_thoai character varying(20),
    dia_chi character varying(255),
    ma_vai_tro integer,
    trang_thai boolean DEFAULT true,
    CONSTRAINT nguoidung_email_check CHECK (((email)::text ~~ '%@gmail.com'::text)),
    CONSTRAINT nguoidung_so_dien_thoai_check CHECK (((so_dien_thoai)::text ~ '^[0-9]{10}$'::text))
);


ALTER TABLE public.nguoidung OWNER TO postgres;

--
-- Name: nguoidung_ma_nguoi_dung_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nguoidung_ma_nguoi_dung_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nguoidung_ma_nguoi_dung_seq OWNER TO postgres;

--
-- Name: nguoidung_ma_nguoi_dung_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nguoidung_ma_nguoi_dung_seq OWNED BY public.nguoidung.ma_nguoi_dung;


--
-- Name: sanpham; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sanpham (
    ma_san_pham integer NOT NULL,
    ten_san_pham character varying(100),
    gia numeric(38,2),
    so_luong_ton integer,
    size character varying(50),
    mau_sac character varying(50),
    hinh_anh character varying(255),
    mo_ta character varying(255),
    ma_danh_muc integer,
    ma_thuong_hieu integer,
    CONSTRAINT sanpham_gia_check CHECK ((gia >= (0)::numeric)),
    CONSTRAINT sanpham_so_luong_ton_check CHECK ((so_luong_ton >= 0))
);


ALTER TABLE public.sanpham OWNER TO postgres;

--
-- Name: sanpham_ma_san_pham_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sanpham_ma_san_pham_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sanpham_ma_san_pham_seq OWNER TO postgres;

--
-- Name: sanpham_ma_san_pham_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sanpham_ma_san_pham_seq OWNED BY public.sanpham.ma_san_pham;


--
-- Name: thongtingiaohang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thongtingiaohang (
    ma_giao_hang integer NOT NULL,
    ma_don_hang integer,
    ten_nguoi_nhan character varying(100),
    so_dien_thoai character varying(20),
    dia_chi character varying(255)
);


ALTER TABLE public.thongtingiaohang OWNER TO postgres;

--
-- Name: thongtingiaohang_ma_giao_hang_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.thongtingiaohang_ma_giao_hang_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.thongtingiaohang_ma_giao_hang_seq OWNER TO postgres;

--
-- Name: thongtingiaohang_ma_giao_hang_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.thongtingiaohang_ma_giao_hang_seq OWNED BY public.thongtingiaohang.ma_giao_hang;


--
-- Name: thuonghieu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thuonghieu (
    ma_thuong_hieu integer NOT NULL,
    ten_thuong_hieu character varying(100),
    mo_ta character varying(255)
);


ALTER TABLE public.thuonghieu OWNER TO postgres;

--
-- Name: thuonghieu_ma_thuong_hieu_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.thuonghieu_ma_thuong_hieu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.thuonghieu_ma_thuong_hieu_seq OWNER TO postgres;

--
-- Name: thuonghieu_ma_thuong_hieu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.thuonghieu_ma_thuong_hieu_seq OWNED BY public.thuonghieu.ma_thuong_hieu;


--
-- Name: vaitro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vaitro (
    ma_vai_tro integer NOT NULL,
    ten_vai_tro character varying(50)
);


ALTER TABLE public.vaitro OWNER TO postgres;

--
-- Name: vaitro_ma_vai_tro_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vaitro_ma_vai_tro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vaitro_ma_vai_tro_seq OWNER TO postgres;

--
-- Name: vaitro_ma_vai_tro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vaitro_ma_vai_tro_seq OWNED BY public.vaitro.ma_vai_tro;


--
-- Name: chitietdonhang ma_chi_tiet_don_hang; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietdonhang ALTER COLUMN ma_chi_tiet_don_hang SET DEFAULT nextval('public.chitietdonhang_ma_chi_tiet_don_hang_seq'::regclass);


--
-- Name: danhgia ma_danh_gia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhgia ALTER COLUMN ma_danh_gia SET DEFAULT nextval('public.danhgia_ma_danh_gia_seq'::regclass);


--
-- Name: danhmuc ma_danh_muc; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhmuc ALTER COLUMN ma_danh_muc SET DEFAULT nextval('public.danhmuc_ma_danh_muc_seq'::regclass);


--
-- Name: donhang ma_don_hang; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donhang ALTER COLUMN ma_don_hang SET DEFAULT nextval('public.donhang_ma_don_hang_seq'::regclass);


--
-- Name: giohang ma_gio_hang; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giohang ALTER COLUMN ma_gio_hang SET DEFAULT nextval('public.giohang_ma_gio_hang_seq'::regclass);


--
-- Name: lienhe ma_lien_he; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lienhe ALTER COLUMN ma_lien_he SET DEFAULT nextval('public.lienhe_ma_lien_he_seq'::regclass);


--
-- Name: magiamgia ma_giam_gia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magiamgia ALTER COLUMN ma_giam_gia SET DEFAULT nextval('public.magiamgia_ma_giam_gia_seq'::regclass);


--
-- Name: nguoidung ma_nguoi_dung; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung ALTER COLUMN ma_nguoi_dung SET DEFAULT nextval('public.nguoidung_ma_nguoi_dung_seq'::regclass);


--
-- Name: sanpham ma_san_pham; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sanpham ALTER COLUMN ma_san_pham SET DEFAULT nextval('public.sanpham_ma_san_pham_seq'::regclass);


--
-- Name: thongtingiaohang ma_giao_hang; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thongtingiaohang ALTER COLUMN ma_giao_hang SET DEFAULT nextval('public.thongtingiaohang_ma_giao_hang_seq'::regclass);


--
-- Name: thuonghieu ma_thuong_hieu; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thuonghieu ALTER COLUMN ma_thuong_hieu SET DEFAULT nextval('public.thuonghieu_ma_thuong_hieu_seq'::regclass);


--
-- Name: vaitro ma_vai_tro; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaitro ALTER COLUMN ma_vai_tro SET DEFAULT nextval('public.vaitro_ma_vai_tro_seq'::regclass);


--
-- Data for Name: chitietdonhang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chitietdonhang (ma_chi_tiet_don_hang, ma_don_hang, ma_san_pham, so_luong, gia) FROM stdin;
1	1	1	1	850000.00
2	1	3	1	920000.00
3	2	7	1	980000.00
4	3	9	1	3200000.00
5	4	12	1	180000.00
\.


--
-- Data for Name: chitietgiohang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chitietgiohang (ma_gio_hang, ma_san_pham, so_luong) FROM stdin;
1	1	1
1	3	2
1	7	1
2	12	1
2	18	1
2	25	1
3	9	1
3	21	2
3	33	1
\.


--
-- Data for Name: danhgia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.danhgia (ma_danh_gia, ma_nguoi_dung, ma_san_pham, so_sao, binh_luan, ngay_danh_gia, trang_thai) FROM stdin;
1	4	1	5	San pham rat dep	2026-05-14 21:50:33.977089	Hiển thị
2	5	7	4	Chat lieu tot	2026-05-14 21:50:33.977089	Hiển thị
3	6	9	5	Rat hai long	2026-05-14 21:50:33.977089	Hiển thị
4	4	3	5	Mau dep	2026-05-14 21:50:33.977089	Hiển thị
5	5	12	4	Dang tien	2026-05-14 21:50:33.977089	Hiển thị
\.


--
-- Data for Name: danhmuc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.danhmuc (ma_danh_muc, ten_danh_muc) FROM stdin;
1	Áo dài
2	Nón lá
3	Túi
4	Giày / Guốc
5	Trang sức
6	Khăn lụa
\.


--
-- Data for Name: donhang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.donhang (ma_don_hang, ma_nguoi_dung, ngay_dat, trang_thai, phuong_thuc_thanh_toan, tong_tien, phi_van_chuyen, ma_giam_gia, tien_giam) FROM stdin;
1	4	2026-05-14 21:50:14.837824	Da thanh toan	COD	1500000.00	30000.00	1	150000.00
2	5	2026-05-14 21:50:14.837824	Dang xu ly	Banking	980000.00	30000.00	2	50000.00
3	6	2026-05-14 21:50:14.837824	Da giao	COD	2200000.00	30000.00	\N	0.00
4	4	2026-05-14 21:50:14.837824	Cho xac nhan	COD	760000.00	30000.00	3	50000.00
5	5	2026-05-14 21:50:14.837824	Dang giao	Banking	1250000.00	30000.00	\N	0.00
\.


--
-- Data for Name: giohang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.giohang (ma_gio_hang, ma_nguoi_dung) FROM stdin;
1	4
2	5
3	6
\.


--
-- Data for Name: lienhe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lienhe (ma_lien_he, ma_nguoi_dung, noi_dung, phan_hoi, trang_thai) FROM stdin;
1	4	Co hang moi khong?	Co nhieu mau moi	Da phan hoi
2	5	Ship bao lau?	2-3 ngay	Da phan hoi
3	6	Co giam gia khong?	\N	Chua xu ly
4	4	Size L con khong?	Con hang	Da phan hoi
5	5	Chat lieu the nao?	Lua cao cap	Da phan hoi
\.


--
-- Data for Name: magiamgia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.magiamgia (ma_giam_gia, ma_code, ten_chuong_trinh, loai_giam, gia_tri_giam, gia_tri_don_hang_toi_thieu, giam_toi_da, so_luong, ngay_bat_dau, ngay_ket_thuc, trang_thai) FROM stdin;
1	SALE10	Giam 10% Toan Bo	PhanTram	10.00	0.00	500000.00	100	2026-01-01 00:00:00	2026-12-31 00:00:00	t
2	SALE20	Giam 20% Mua 2	PhanTram	20.00	300000.00	800000.00	50	2026-01-01 00:00:00	2026-12-31 00:00:00	t
3	FREESHIP	Free ship	TienMat	50000.00	200000.00	50000.00	200	2026-01-01 00:00:00	2026-12-31 00:00:00	t
4	NEWUSER	Khach hang moi	PhanTram	15.00	250000.00	100000.00	300	2026-01-01 00:00:00	2026-12-31 00:00:00	t
5	VIP	Khach VIP	PhanTram	25.00	500000.00	1500000.00	20	2026-01-01 00:00:00	2026-12-31 00:00:00	t
\.


--
-- Data for Name: nguoidung; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nguoidung (ma_nguoi_dung, ten_dang_nhap, mat_khau, email, so_dien_thoai, dia_chi, ma_vai_tro, trang_thai) FROM stdin;
1	admin01	123456	admin01@gmail.com	0900000001	Da Nang	1	t
2	staff01	123456	staff01@gmail.com	0900000002	Hue	2	t
3	staff02	123456	staff02@gmail.com	0900000003	Da Nang	2	t
4	user01	123456	user01@gmail.com	0900000004	Hoi An	3	t
5	user02	123456	user02@gmail.com	0900000005	Da Nang	3	t
6	user03	123456	user03@gmail.com	0900000006	Quang Nam	3	t
\.


--
-- Data for Name: sanpham; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sanpham (ma_san_pham, ten_san_pham, gia, so_luong_ton, size, mau_sac, hinh_anh, mo_ta, ma_danh_muc, ma_thuong_hieu) FROM stdin;
2	Áo dài trắng học sinh	650000.00	15	S,M,L	Trắng	aodai_trang.jpg	Áo dài trắng tinh khôi	1	1
3	Áo dài cách tân hoa nhí	920000.00	8	M,L	Hồng	aodai_hoa.jpg	Áo dài cách tân trẻ trung	1	1
4	Áo dài lụa xanh ngọc	1100000.00	6	S,M	Xanh ngọc	aodai_xanh.jpg	Áo dài lụa mềm mại	1	1
5	Áo dài thêu cổ điển	1450000.00	5	M,L	Vàng kem	aodai_theu.jpg	Áo dài thêu phong cách Huế	1	1
6	Áo dài nhung cổ cao	1700000.00	4	L,XL	Đen	aodai_nhung.jpg	Áo dài nhung sang trọng	1	1
7	Áo dài công sở pastel	980000.00	7	S,M,L	Pastel	aodai_pastel.jpg	Áo dài công sở thanh lịch	1	1
8	Áo dài minimal trắng kem	1050000.00	5	M,L	Kem	aodai_kem.jpg	Thiết kế tối giản hiện đại	1	1
9	Áo dài cưới đính ngọc	3200000.00	3	M,L	Đỏ đô	aodai_cuoi.jpg	Áo dài cưới cao cấp	1	1
10	Áo dài luxury phượng hoàng	4500000.00	2	L,XL	Vàng	aodai_luxury.jpg	Áo dài thêu phượng hoàng	1	1
11	Nón lá truyền thống	120000.00	20	Free Size	Be	nonla_1.jpg	Nón lá thủ công	2	1
12	Nón lá quai lụa	180000.00	10	Free Size	Kem	nonla_2.jpg	Nón lá phối quai lụa	2	1
13	Nón lá thêu hoa	220000.00	8	Free Size	Trắng	nonla_3.jpg	Nón lá thêu họa tiết hoa	2	1
14	Nón lá vintage	250000.00	6	Free Size	Nâu	nonla_4.jpg	Phong cách cổ điển	2	1
15	Nón lá nghệ thuật	300000.00	5	Free Size	Vàng kem	nonla_5.jpg	Nón lá decor cao cấp	2	1
16	Túi clutch ngọc trai	550000.00	8	Free Size	Trắng	tui_1.jpg	Clutch dự tiệc sang trọng	3	1
17	Túi vintage gấm	480000.00	10	Free Size	Đỏ	tui_2.jpg	Túi phong cách cổ điển	3	1
18	Túi lụa tối giản	390000.00	12	Free Size	Kem	tui_3.jpg	Túi thanh lịch hiện đại	3	1
19	Túi cói truyền thống	350000.00	15	Free Size	Nâu	tui_4.jpg	Túi cói handmade	3	1
20	Túi pastel hiện đại	520000.00	7	Free Size	Hồng pastel	tui_5.jpg	Túi thời trang trẻ trung	3	1
21	Guốc gỗ truyền thống	450000.00	10	36,37,38	Nâu	guoc_1.jpg	Guốc gỗ cổ điển	4	1
22	Guốc thêu hoa	520000.00	8	36,37,38	Đỏ	guoc_2.jpg	Guốc thêu thủ công	4	1
23	Cao gót nude	680000.00	10	36,37,38,39	Be	giay_1.jpg	Cao gót phối áo dài	4	1
24	Sandal ngọc trai	620000.00	9	36,37,38	Trắng	giay_2.jpg	Sandal nữ tính	4	1
25	Giày búp bê trắng	480000.00	12	35,36,37	Trắng	giay_3.jpg	Giày nhẹ nhàng thanh lịch	4	1
26	Sneaker trắng basic	700000.00	10	37,38,39	Trắng	giay_4.jpg	Sneaker mix áo dài hiện đại	4	1
27	Guốc luxury đính đá	950000.00	5	36,37,38	Vàng	giay_5.jpg	Guốc cao cấp dự tiệc	4	1
28	Sandal tối giản	540000.00	11	36,37,38	Đen	giay_6.jpg	Phong cách công sở	4	1
29	Cài áo ngọc trai	250000.00	15	Free Size	Trắng	caiao_1.jpg	Cài áo sang trọng	5	1
30	Cài áo hoa sen	220000.00	10	Free Size	Vàng	caiao_2.jpg	Cài áo phong cách Việt	5	1
31	Cài áo vintage	280000.00	8	Free Size	Đồng	caiao_3.jpg	Trang sức cổ điển	5	1
32	Cài áo tối giản	190000.00	12	Free Size	Bạc	caiao_4.jpg	Thiết kế minimal	5	1
33	Cài áo luxury	350000.00	6	Free Size	Vàng	caiao_5.jpg	Đính đá cao cấp	5	1
34	Vòng tay ngọc trai	320000.00	10	Free Size	Trắng	vongtay_1.jpg	Vòng tay thanh lịch	5	1
35	Vòng tay lụa đỏ	180000.00	14	Free Size	Đỏ	vongtay_2.jpg	Vòng tay truyền thống	5	1
36	Vòng tay bạc	290000.00	11	Free Size	Bạc	vongtay_3.jpg	Phong cách hiện đại	5	1
37	Vòng tay vintage	310000.00	7	Free Size	Đồng	vongtay_4.jpg	Phong cách cổ điển	5	1
38	Vòng tay tối giản	260000.00	9	Free Size	Đen	vongtay_5.jpg	Thiết kế thanh lịch	5	1
39	Khăn lụa đỏ truyền thống	350000.00	10	Free Size	Đỏ	khan_1.jpg	Khăn lụa mềm mại	6	1
40	Khăn lụa pastel	380000.00	9	Free Size	Hồng pastel	khan_2.jpg	Phong cách hiện đại	6	1
41	Khăn lụa thêu hoa	450000.00	7	Free Size	Kem	khan_3.jpg	Khăn lụa cổ điển	6	1
42	Khăn lụa công sở	320000.00	12	Free Size	Xám	khan_4.jpg	Thiết kế tối giản	6	1
43	Khăn lụa luxury	550000.00	5	Free Size	Vàng	khan_5.jpg	Khăn lụa cao cấp	6	1
1	Áo Dài Lụa Hoa Đào Truyền Thống	850000.00	10	S,M,L	Hồng nhạt	aodai_lua.jpg	Áo dài lụa hoa đào truyền thống màu hồng nhạt	1	1
\.


--
-- Data for Name: thongtingiaohang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thongtingiaohang (ma_giao_hang, ma_don_hang, ten_nguoi_nhan, so_dien_thoai, dia_chi) FROM stdin;
1	1	Nguyen Van A	0900000001	Da Nang
2	2	Tran Thi B	0900000002	Hue
3	3	Le Van C	0900000003	Hoi An
4	4	Pham Van D	0900000004	Quang Nam
5	5	Hoang Thi E	0900000005	Da Nang
\.


--
-- Data for Name: thuonghieu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thuonghieu (ma_thuong_hieu, ten_thuong_hieu, mo_ta) FROM stdin;
1	ViSilk	Phong cách truyền thống Việt Nam
\.


--
-- Data for Name: vaitro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vaitro (ma_vai_tro, ten_vai_tro) FROM stdin;
1	Admin
2	NhanVien
3	KhachHang
\.


--
-- Name: chitietdonhang_ma_chi_tiet_don_hang_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chitietdonhang_ma_chi_tiet_don_hang_seq', 5, true);


--
-- Name: danhgia_ma_danh_gia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.danhgia_ma_danh_gia_seq', 5, true);


--
-- Name: danhmuc_ma_danh_muc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.danhmuc_ma_danh_muc_seq', 6, true);


--
-- Name: donhang_ma_don_hang_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.donhang_ma_don_hang_seq', 5, true);


--
-- Name: giohang_ma_gio_hang_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.giohang_ma_gio_hang_seq', 3, true);


--
-- Name: lienhe_ma_lien_he_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lienhe_ma_lien_he_seq', 5, true);


--
-- Name: magiamgia_ma_giam_gia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.magiamgia_ma_giam_gia_seq', 5, true);


--
-- Name: nguoidung_ma_nguoi_dung_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nguoidung_ma_nguoi_dung_seq', 6, true);


--
-- Name: sanpham_ma_san_pham_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sanpham_ma_san_pham_seq', 43, true);


--
-- Name: thongtingiaohang_ma_giao_hang_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.thongtingiaohang_ma_giao_hang_seq', 5, true);


--
-- Name: thuonghieu_ma_thuong_hieu_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.thuonghieu_ma_thuong_hieu_seq', 5, true);


--
-- Name: vaitro_ma_vai_tro_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vaitro_ma_vai_tro_seq', 3, true);


--
-- Name: chitietdonhang chitietdonhang_ma_don_hang_ma_san_pham_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_ma_don_hang_ma_san_pham_key UNIQUE (ma_don_hang, ma_san_pham);


--
-- Name: chitietdonhang chitietdonhang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_pkey PRIMARY KEY (ma_chi_tiet_don_hang);


--
-- Name: chitietgiohang chitietgiohang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietgiohang
    ADD CONSTRAINT chitietgiohang_pkey PRIMARY KEY (ma_gio_hang, ma_san_pham);


--
-- Name: danhgia danhgia_ma_nguoi_dung_ma_san_pham_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_ma_nguoi_dung_ma_san_pham_key UNIQUE (ma_nguoi_dung, ma_san_pham);


--
-- Name: danhgia danhgia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_pkey PRIMARY KEY (ma_danh_gia);


--
-- Name: danhmuc danhmuc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhmuc
    ADD CONSTRAINT danhmuc_pkey PRIMARY KEY (ma_danh_muc);


--
-- Name: donhang donhang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_pkey PRIMARY KEY (ma_don_hang);


--
-- Name: giohang giohang_ma_nguoi_dung_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_ma_nguoi_dung_key UNIQUE (ma_nguoi_dung);


--
-- Name: giohang giohang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_pkey PRIMARY KEY (ma_gio_hang);


--
-- Name: lienhe lienhe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lienhe
    ADD CONSTRAINT lienhe_pkey PRIMARY KEY (ma_lien_he);


--
-- Name: magiamgia magiamgia_ma_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magiamgia
    ADD CONSTRAINT magiamgia_ma_code_key UNIQUE (ma_code);


--
-- Name: magiamgia magiamgia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magiamgia
    ADD CONSTRAINT magiamgia_pkey PRIMARY KEY (ma_giam_gia);


--
-- Name: nguoidung nguoidung_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung
    ADD CONSTRAINT nguoidung_email_key UNIQUE (email);


--
-- Name: nguoidung nguoidung_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung
    ADD CONSTRAINT nguoidung_pkey PRIMARY KEY (ma_nguoi_dung);


--
-- Name: nguoidung nguoidung_so_dien_thoai_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung
    ADD CONSTRAINT nguoidung_so_dien_thoai_key UNIQUE (so_dien_thoai);


--
-- Name: nguoidung nguoidung_ten_dang_nhap_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung
    ADD CONSTRAINT nguoidung_ten_dang_nhap_key UNIQUE (ten_dang_nhap);


--
-- Name: sanpham sanpham_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_pkey PRIMARY KEY (ma_san_pham);


--
-- Name: thongtingiaohang thongtingiaohang_ma_don_hang_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thongtingiaohang
    ADD CONSTRAINT thongtingiaohang_ma_don_hang_key UNIQUE (ma_don_hang);


--
-- Name: thongtingiaohang thongtingiaohang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thongtingiaohang
    ADD CONSTRAINT thongtingiaohang_pkey PRIMARY KEY (ma_giao_hang);


--
-- Name: thuonghieu thuonghieu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thuonghieu
    ADD CONSTRAINT thuonghieu_pkey PRIMARY KEY (ma_thuong_hieu);


--
-- Name: vaitro vaitro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaitro
    ADD CONSTRAINT vaitro_pkey PRIMARY KEY (ma_vai_tro);


--
-- Name: chitietdonhang chitietdonhang_ma_don_hang_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_ma_don_hang_fkey FOREIGN KEY (ma_don_hang) REFERENCES public.donhang(ma_don_hang) ON DELETE CASCADE;


--
-- Name: chitietdonhang chitietdonhang_ma_san_pham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT chitietdonhang_ma_san_pham_fkey FOREIGN KEY (ma_san_pham) REFERENCES public.sanpham(ma_san_pham);


--
-- Name: chitietgiohang chitietgiohang_ma_gio_hang_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietgiohang
    ADD CONSTRAINT chitietgiohang_ma_gio_hang_fkey FOREIGN KEY (ma_gio_hang) REFERENCES public.giohang(ma_gio_hang) ON DELETE CASCADE;


--
-- Name: chitietgiohang chitietgiohang_ma_san_pham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chitietgiohang
    ADD CONSTRAINT chitietgiohang_ma_san_pham_fkey FOREIGN KEY (ma_san_pham) REFERENCES public.sanpham(ma_san_pham);


--
-- Name: danhgia danhgia_ma_nguoi_dung_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_ma_nguoi_dung_fkey FOREIGN KEY (ma_nguoi_dung) REFERENCES public.nguoidung(ma_nguoi_dung);


--
-- Name: danhgia danhgia_ma_san_pham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danhgia
    ADD CONSTRAINT danhgia_ma_san_pham_fkey FOREIGN KEY (ma_san_pham) REFERENCES public.sanpham(ma_san_pham);


--
-- Name: donhang donhang_ma_giam_gia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_ma_giam_gia_fkey FOREIGN KEY (ma_giam_gia) REFERENCES public.magiamgia(ma_giam_gia);


--
-- Name: donhang donhang_ma_nguoi_dung_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT donhang_ma_nguoi_dung_fkey FOREIGN KEY (ma_nguoi_dung) REFERENCES public.nguoidung(ma_nguoi_dung);


--
-- Name: giohang giohang_ma_nguoi_dung_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giohang
    ADD CONSTRAINT giohang_ma_nguoi_dung_fkey FOREIGN KEY (ma_nguoi_dung) REFERENCES public.nguoidung(ma_nguoi_dung);


--
-- Name: lienhe lienhe_ma_nguoi_dung_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lienhe
    ADD CONSTRAINT lienhe_ma_nguoi_dung_fkey FOREIGN KEY (ma_nguoi_dung) REFERENCES public.nguoidung(ma_nguoi_dung);


--
-- Name: nguoidung nguoidung_ma_vai_tro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung
    ADD CONSTRAINT nguoidung_ma_vai_tro_fkey FOREIGN KEY (ma_vai_tro) REFERENCES public.vaitro(ma_vai_tro);


--
-- Name: sanpham sanpham_ma_danh_muc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_ma_danh_muc_fkey FOREIGN KEY (ma_danh_muc) REFERENCES public.danhmuc(ma_danh_muc);


--
-- Name: sanpham sanpham_ma_thuong_hieu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sanpham
    ADD CONSTRAINT sanpham_ma_thuong_hieu_fkey FOREIGN KEY (ma_thuong_hieu) REFERENCES public.thuonghieu(ma_thuong_hieu);


--
-- Name: thongtingiaohang thongtingiaohang_ma_don_hang_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thongtingiaohang
    ADD CONSTRAINT thongtingiaohang_ma_don_hang_fkey FOREIGN KEY (ma_don_hang) REFERENCES public.donhang(ma_don_hang);


--
-- PostgreSQL database dump complete
--

\unrestrict N4uIbtHPJq7MjMlhzJ8oh6VgpGJMOzaZFxdZ3RKOGUAnc9hqje2882RajVSorYv

