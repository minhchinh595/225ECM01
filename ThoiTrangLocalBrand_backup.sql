--
-- PostgreSQL database dump
--

\restrict MQMPiTaPAPX8V8Z97hyt50VHG5rMa5xLMShD3h7I2OXC2yTGKktgzYepYJNAbEg

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
    hinh_anh_2 character varying(255),
    hinh_anh_3 character varying(255),
    hinh_anh_4 character varying(255),
    video character varying(255),
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
2	2	9	1	180000.00
3	2	13	1	290000.00
4	3	4	1	790000.00
5	3	17	1	530000.00
6	6	17	1	420000.00
7	6	28	1	250000.00
8	7	1	2	850000.00
\.


--
-- Data for Name: chitietgiohang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chitietgiohang (ma_gio_hang, ma_san_pham, so_luong) FROM stdin;
1	1	1
1	9	1
2	13	2
4	4	1
\.


--
-- Data for Name: danhgia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.danhgia (ma_danh_gia, ma_nguoi_dung, ma_san_pham, so_sao, binh_luan, ngay_danh_gia, trang_thai) FROM stdin;
1	3	1	5	Áo dài rất đẹp, chất vải mềm và mặc rất tôn dáng.	2026-05-20 21:51:22.499486	Hiển thị
2	3	9	4	Nón lá nhẹ, phối với áo dài rất hợp.	2026-05-20 21:51:22.499486	Hiển thị
3	2	13	5	Túi đẹp, kiểu dáng sang trọng.	2026-05-20 21:51:22.499486	Hiển thị
4	1	17	4	Guốc chắc chắn, màu đẹp.	2026-05-20 21:51:22.499486	Hiển thị
5	3	28	5	Khăn lụa mềm, màu pastel rất xinh.	2026-05-20 21:51:22.499486	Hiển thị
6	3	2	5	Sản phẩm oke	2026-05-26 23:38:54.776301	Hiển thị
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
1	3	2026-05-20 21:50:30.883012	Chờ xác nhận	Thanh toán khi nhận hàng	850000.00	30000.00	1	85000.00
3	2	2026-05-20 21:50:30.883012	Hoàn thành	Thanh toán khi nhận hàng	1320000.00	30000.00	3	150000.00
4	1	2026-05-20 21:50:30.883012	Hoàn thành	Chuyển khoản	1800000.00	0.00	5	300000.00
5	3	2026-05-20 21:50:30.883012	Đã hủy	Thanh toán khi nhận hàng	650000.00	30000.00	\N	0.00
2	3	2026-05-20 21:50:30.883012	Da thanh toan	Chuyển khoản	470000.00	25000.00	2	50000.00
6	3	2026-05-20 22:00:49.185939	Dang xu ly	COD	670000.00	0.00	\N	0.00
7	3	2026-05-25 20:48:10.753698	Da giao	COD	1600000.00	0.00	1	100000.00
\.


--
-- Data for Name: giohang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.giohang (ma_gio_hang, ma_nguoi_dung) FROM stdin;
1	1
2	2
4	3
\.


--
-- Data for Name: lienhe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lienhe (ma_lien_he, ma_nguoi_dung, noi_dung, phan_hoi, trang_thai) FROM stdin;
1	3	Shop còn mẫu áo dài lụa xanh ngọc size M không?	Dạ shop còn size M ạ.	Đã phản hồi
2	3	Thời gian giao hàng khoảng bao lâu?	Dạ từ 2 đến 4 ngày tùy khu vực ạ.	Đã phản hồi
3	2	Khách hỏi cách đổi size sản phẩm.	Đã hướng dẫn chính sách đổi size.	Đã phản hồi
4	1	Kiểm tra tồn kho sản phẩm áo dài cưới.	Sản phẩm còn 8 cái trong kho.	Đã phản hồi
5	3	Shop có gói quà khăn lụa không?	\N	Chưa phản hồi
\.


--
-- Data for Name: magiamgia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.magiamgia (ma_giam_gia, ma_code, ten_chuong_trinh, loai_giam, gia_tri_giam, gia_tri_don_hang_toi_thieu, giam_toi_da, so_luong, ngay_bat_dau, ngay_ket_thuc, trang_thai) FROM stdin;
1	VISILK10	Giảm 10% cho đơn đầu tiên	PhanTram	10.00	300000.00	100000.00	100	2026-05-01 00:00:00	2026-12-31 23:59:59	t
2	FREESHIP50	Giảm phí vận chuyển	TienMat	50000.00	500000.00	50000.00	80	2026-05-01 00:00:00	2026-12-31 23:59:59	t
3	AODAI15	Ưu đãi áo dài	PhanTram	15.00	700000.00	150000.00	60	2026-05-01 00:00:00	2026-10-31 23:59:59	t
4	LUA100K	Giảm 100K sản phẩm lụa	TienMat	100000.00	800000.00	100000.00	50	2026-05-01 00:00:00	2026-11-30 23:59:59	t
5	VIP20	Ưu đãi khách hàng VIP	PhanTram	20.00	1500000.00	300000.00	30	2026-05-01 00:00:00	2026-12-31 23:59:59	t
\.


--
-- Data for Name: nguoidung; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nguoidung (ma_nguoi_dung, ten_dang_nhap, mat_khau, email, so_dien_thoai, dia_chi, ma_vai_tro, trang_thai) FROM stdin;
1	admin	123456	admin@gmail.com	0900000001	Đà Nẵng	1	t
2	nhanvien	123456	nhanvien@gmail.com	0900000002	Huế	2	t
3	khachhang	123456	khachhang@gmail.com	0900000003	Quảng Nam	3	t
\.


--
-- Data for Name: sanpham; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sanpham (ma_san_pham, ten_san_pham, gia, so_luong_ton, size, mau_sac, hinh_anh, hinh_anh_2, hinh_anh_3, hinh_anh_4, video, mo_ta, ma_danh_muc, ma_thuong_hieu) FROM stdin;
2	Áo dài trắng học sinh	550000.00	30	S,M,L,XL	Trắng	ao-dai-trang-hoc-sinh-1.jpg	ao-dai-trang-hoc-sinh-2.jpg	ao-dai-trang-hoc-sinh-3.jpg	\N	ao-dai-trang-hoc-sinh.mp4	Áo dài trắng tinh khôi phù hợp học sinh, sinh viên	1	1
3	Áo dài cách tân hoa nhí	690000.00	25	S,M,L	Kem hoa nhí	ao-dai-cach-tan-hoa-nhi-1.jpg	ao-dai-cach-tan-hoa-nhi-2.jpg	ao-dai-cach-tan-hoa-nhi-3.jpg	\N	\N	Áo dài cách tân trẻ trung với họa tiết hoa nhí nhẹ nhàng	1	1
4	Áo dài lụa xanh ngọc	790000.00	18	S,M,L,XL	Xanh ngọc	ao-dai-lua-xanh-ngoc-1.jpg	ao-dai-lua-xanh-ngoc-2.jpg	ao-dai-lua-xanh-ngoc-3.jpg	\N	ao-dai-lua-xanh-ngoc.mp4	Áo dài lụa xanh ngọc sang trọng, mềm mại	1	1
5	Áo dài thêu cổ điển	920000.00	15	S,M,L	Đỏ đô	ao-dai-theu-co-dien-1.jpg	ao-dai-theu-co-dien-2.jpg	ao-dai-theu-co-dien-3.jpg	\N	\N	Áo dài thêu họa tiết cổ điển, phù hợp sự kiện trang trọng	1	1
6	Áo dài minimal trắng kem	650000.00	22	S,M,L	Trắng kem	ao-dai-minimal-trang-kem-1.jpg	ao-dai-minimal-trang-kem-2.jpg	ao-dai-minimal-trang-kem-3.jpg	\N	\N	Áo dài tối giản màu trắng kem, thanh lịch và dễ mặc	1	1
7	Áo dài cưới đính ngọc	1500000.00	8	S,M,L	Trắng ngọc	ao-dai-cuoi-dinh-ngoc-1.jpg	ao-dai-cuoi-dinh-ngoc-2.jpg	ao-dai-cuoi-dinh-ngoc-3.jpg	ao-dai-cuoi-dinh-ngoc-4.jpg	ao-dai-cuoi-dinh-ngoc.mp4	Áo dài cưới đính ngọc sang trọng, phù hợp lễ cưới và chụp ảnh	1	1
8	Nón lá truyền thống	180000.00	40	Freesize	Tự nhiên	non-la-truyen-thong-1.jpg	non-la-truyen-thong-2.jpg	\N	\N	\N	Nón lá truyền thống Việt Nam, nhẹ và bền	2	1
9	Nón lá quai lụa	230000.00	35	Freesize	Trắng kem	non-la-quai-lua-1.jpg	non-la-quai-lua-2.jpg	\N	\N	\N	Nón lá có quai lụa mềm mại, phù hợp phối với áo dài	2	1
10	Nón lá thêu hoa	280000.00	25	Freesize	Be thêu hoa	non-la-theu-hoa-1.jpg	non-la-theu-hoa-2.jpg	non-la-theu-hoa-3.jpg	\N	\N	Nón lá thêu hoa thủ công, tinh tế và nữ tính	2	1
11	Nón lá vintage	260000.00	20	Freesize	Nâu nhạt	non-la-vintage-1.jpg	non-la-vintage-2.jpg	\N	\N	\N	Nón lá phong cách vintage, phù hợp chụp ảnh ngoại cảnh	2	1
12	Túi clutch ngọc trai	420000.00	18	Freesize	Trắng ngọc trai	tui-clutch-ngoc-trai-1.jpg	tui-clutch-ngoc-trai-2.jpg	tui-clutch-ngoc-trai-3.jpg	\N	\N	Túi clutch đính ngọc trai sang trọng, hợp với áo dài dự tiệc	3	1
13	Túi vintage gấm	390000.00	20	Freesize	Đỏ gấm	tui-vintage-gam-1.jpg	tui-vintage-gam-2.jpg	tui-vintage-gam-3.jpg	\N	\N	Túi gấm phong cách vintage, nổi bật và cổ điển	3	1
14	Túi lụa tối giản	320000.00	24	Freesize	Kem	tui-lua-toi-gian-1.jpg	tui-lua-toi-gian-2.jpg	\N	\N	\N	Túi lụa thiết kế tối giản, nhẹ nhàng và thanh lịch	3	1
15	Túi cói truyền thống	290000.00	30	Freesize	Nâu cói	tui-coi-truyen-thong-1.jpg	tui-coi-truyen-thong-2.jpg	\N	\N	\N	Túi cói truyền thống phối đẹp với trang phục local brand	3	1
16	Guốc gỗ truyền thống	350000.00	28	35,36,37,38,39	Nâu gỗ	guoc-go-truyen-thong-1.jpg	guoc-go-truyen-thong-2.jpg	\N	\N	\N	Guốc gỗ truyền thống phù hợp mặc cùng áo dài	4	1
18	Cao gót nude	480000.00	25	35,36,37,38,39	Nude	cao-got-nude-1.jpg	cao-got-nude-2.jpg	\N	\N	\N	Giày cao gót màu nude dễ phối với nhiều mẫu áo dài	4	1
19	Sandal ngọc trai	450000.00	18	35,36,37,38,39	Trắng ngọc trai	sandal-ngoc-trai-1.jpg	sandal-ngoc-trai-2.jpg	sandal-ngoc-trai-3.jpg	\N	\N	Sandal đính ngọc trai sang trọng, phù hợp đi tiệc	4	1
20	Sneaker trắng basic	700000.00	26	35,36,37,38,39	Trắng	giay-sneaker-trang-1.jpg	giay-sneaker-trang-2.jpg	\N	\N	\N	Giày búp bê trắng nhẹ nhàng, dễ mang hằng ngày	4	1
21	Cài áo ngọc trai	180000.00	35	Freesize	Trắng ngọc trai	cai-ao-ngoc-trai-1.jpg	cai-ao-ngoc-trai-2.jpg	\N	\N	\N	Cài áo ngọc trai nhỏ gọn, sang trọng	5	1
22	Cài áo hoa sen	210000.00	30	Freesize	Vàng đồng	cai-ao-hoa-sen-1.jpg	cai-ao-hoa-sen-2.jpg	\N	\N	\N	Cài áo hình hoa sen mang nét truyền thống Việt Nam	5	1
23	Cài áo vintage	190000.00	28	Freesize	Đồng cổ	cai-ao-vintage-1.jpg	cai-ao-vintage-2.jpg	\N	\N	\N	Cài áo phong cách vintage, phù hợp áo dài và váy	5	1
24	Vòng tay ngọc trai	260000.00	25	Freesize	Trắng ngọc trai	vong-tay-ngoc-trai-1.jpg	vong-tay-ngoc-trai-2.jpg	\N	\N	\N	Vòng tay ngọc trai thanh lịch, nữ tính	5	1
25	Vòng tay lụa đỏ	170000.00	32	Freesize	Đỏ	vong-tay-lua-do-1.jpg	vong-tay-lua-do-2.jpg	\N	\N	\N	Vòng tay lụa đỏ nổi bật, phù hợp phối phụ kiện truyền thống	5	1
26	Vòng tay bạc	300000.00	20	Freesize	Bạc	vong-tay-bac-1.jpg	vong-tay-bac-2.jpg	\N	\N	\N	Vòng tay bạc đơn giản, tinh tế	5	1
27	Khăn lụa đỏ truyền thống	280000.00	30	Freesize	Đỏ	khan-lua-do-truyen-thong-1.jpg	khan-lua-do-truyen-thong-2.jpg	\N	\N	\N	Khăn lụa đỏ truyền thống, mềm mại và nổi bật	6	1
29	Khăn lụa thêu hoa	320000.00	24	Freesize	Kem thêu hoa	khan-lua-theu-hoa-1.jpg	khan-lua-theu-hoa-2.jpg	khan-lua-theu-hoa-3.jpg	\N	\N	Khăn lụa thêu hoa tinh tế, phù hợp làm quà tặng	6	1
30	Khăn lụa luxury	450000.00	15	Freesize	Vàng kem	khan-lua-luxury-1.jpg	khan-lua-luxury-2.jpg	khan-lua-luxury-3.jpg	\N	\N	Khăn lụa cao cấp, sang trọng và mềm mại	6	1
17	Guốc thêu hoa	420000.00	21	35,36,37,38,39	Kem thêu hoa	guoc-theu-hoa-1.jpg	guoc-theu-hoa-2.jpg	guoc-theu-hoa-3.jpg	\N	\N	Guốc thêu hoa nhẹ nhàng, nữ tính	4	1
28	Khăn lụa pastel	250000.00	34	Freesize	Pastel	khan-lua-pastel-1.jpg	khan-lua-pastel-2.jpg	\N	\N	\N	Khăn lụa pastel nhẹ nhàng, dễ phối đồ	6	1
1	Áo Dài Lụa Hoa Đào Truyền Thống	850000.00	18	S,M,L,XL	Hồng đào	ao-dai-lua-hoa-dao-1.jpg	ao-dai-lua-hoa-dao-2.jpg	ao-dai-lua-hoa-dao-3.jpg	ao-dai-lua-hoa-dao-4.jpg	ao-dai-lua-hoa-dao.mp4	Áo dài lụa họa tiết hoa đào truyền thống, dịu dàng và nữ tính	1	1
\.


--
-- Data for Name: thongtingiaohang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thongtingiaohang (ma_giao_hang, ma_don_hang, ten_nguoi_nhan, so_dien_thoai, dia_chi) FROM stdin;
1	1	Nguyễn Thị Mai	0911111111	Hải Châu, Đà Nẵng
2	2	Trần Hoàng Anh	0922222222	Thanh Khê, Đà Nẵng
3	3	Lê Minh Thư	0933333333	Sơn Trà, Đà Nẵng
4	4	Phạm Ngọc Linh	0944444444	Cẩm Lệ, Đà Nẵng
5	5	Đỗ Thanh Vy	0955555555	Liên Chiểu, Đà Nẵng
6	6	Nguyễn Văn A	0900000003	Quảng Nam
7	7	Nguyễn Văn A	0900000003	Quảng Nam
\.


--
-- Data for Name: thuonghieu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thuonghieu (ma_thuong_hieu, ten_thuong_hieu, mo_ta) FROM stdin;
1	ViSilk	Thương hiệu thời trang local brand lấy cảm hứng từ áo dài Việt Nam
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

SELECT pg_catalog.setval('public.chitietdonhang_ma_chi_tiet_don_hang_seq', 8, true);


--
-- Name: danhgia_ma_danh_gia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.danhgia_ma_danh_gia_seq', 6, true);


--
-- Name: danhmuc_ma_danh_muc_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.danhmuc_ma_danh_muc_seq', 6, true);


--
-- Name: donhang_ma_don_hang_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.donhang_ma_don_hang_seq', 7, true);


--
-- Name: giohang_ma_gio_hang_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.giohang_ma_gio_hang_seq', 5, true);


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

SELECT pg_catalog.setval('public.nguoidung_ma_nguoi_dung_seq', 3, true);


--
-- Name: sanpham_ma_san_pham_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sanpham_ma_san_pham_seq', 31, true);


--
-- Name: thongtingiaohang_ma_giao_hang_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.thongtingiaohang_ma_giao_hang_seq', 7, true);


--
-- Name: thuonghieu_ma_thuong_hieu_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.thuonghieu_ma_thuong_hieu_seq', 1, true);


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

\unrestrict MQMPiTaPAPX8V8Z97hyt50VHG5rMa5xLMShD3h7I2OXC2yTGKktgzYepYJNAbEg

