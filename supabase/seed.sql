-- ============================================================
-- seed.sql — Character data for the reading log application
-- Run this after the initial migration to populate the characters table.
-- ============================================================

INSERT INTO characters (id, name, description, sprite_url, unlock_height_cm, rarity) VALUES

-- COMMON characters (0cm – 850cm)
(gen_random_uuid(), '아기 책벌레', '막 태어난 꼬마 책벌레. 책 냄새를 맡으면 행복해해요.', '/sprites/characters/baby-bookworm.png', 0, 'common'),
(gen_random_uuid(), '호기심 고양이', '모든 책의 첫 페이지를 열어보는 호기심 많은 고양이.', '/sprites/characters/curious-cat.png', 10, 'common'),
(gen_random_uuid(), '독서 토끼', '당근 대신 책을 좋아하는 귀여운 토끼.', '/sprites/characters/reading-rabbit.png', 30, 'common'),
(gen_random_uuid(), '필기 다람쥐', '도토리 대신 메모를 모으는 부지런한 다람쥐.', '/sprites/characters/note-squirrel.png', 50, 'common'),
(gen_random_uuid(), '꿈꾸는 구름', '이야기를 들으면 색깔이 변하는 작은 구름.', '/sprites/characters/dreaming-cloud.png', 70, 'common'),
(gen_random_uuid(), '책갈피 요정', '항상 읽던 페이지를 기억해주는 요정.', '/sprites/characters/bookmark-fairy.png', 100, 'common'),
(gen_random_uuid(), '글자 반딧불', '어두운 밤에도 책을 읽을 수 있게 빛을 내는 반딧불.', '/sprites/characters/letter-firefly.png', 120, 'common'),
(gen_random_uuid(), '이야기 달팽이', '느리지만 끝까지 읽는 끈기의 달팽이.', '/sprites/characters/story-snail.png', 150, 'common'),
(gen_random_uuid(), '종이접기 학', '다 읽은 책으로 종이학을 접는 작은 새.', '/sprites/characters/origami-crane.png', 170, 'common'),
(gen_random_uuid(), '잉크 문어', '여덟 개 다리로 동시에 여러 책을 넘기는 문어.', '/sprites/characters/ink-octopus.png', 200, 'common'),
(gen_random_uuid(), '졸린 곰돌이', '자장가 책만 읽으면 스르르 잠이 드는 곰.', '/sprites/characters/sleepy-bear.png', 220, 'common'),
(gen_random_uuid(), '모험 거북이', '등껍질에 세계 지도가 그려진 탐험가 거북이.', '/sprites/characters/adventure-turtle.png', 250, 'common'),
(gen_random_uuid(), '무지개 앵무새', '책을 소리 내어 읽어주는 다정한 앵무새.', '/sprites/characters/rainbow-parrot.png', 280, 'common'),
(gen_random_uuid(), '별똥별 햄스터', '밤하늘 그림책을 좋아하는 작은 햄스터.', '/sprites/characters/shooting-star-hamster.png', 300, 'common'),
(gen_random_uuid(), '노래하는 귀뚜라미', '시를 읽으면 아름다운 노래를 부르는 귀뚜라미.', '/sprites/characters/singing-cricket.png', 330, 'common'),
(gen_random_uuid(), '수집가 까치', '반짝이는 문장을 모으는 까치.', '/sprites/characters/collector-magpie.png', 360, 'common'),
(gen_random_uuid(), '요리사 너구리', '요리책 레시피를 완벽히 외우는 너구리 셰프.', '/sprites/characters/chef-raccoon.png', 390, 'common'),
(gen_random_uuid(), '탐정 고슴도치', '추리소설의 범인을 항상 맞추는 꼼꼼한 고슴도치.', '/sprites/characters/detective-hedgehog.png', 420, 'common'),
(gen_random_uuid(), '화가 카멜레온', '그림책을 보면 같은 색으로 변하는 카멜레온.', '/sprites/characters/artist-chameleon.png', 450, 'common'),
(gen_random_uuid(), '우편배달 비둘기', '좋아하는 책을 친구들에게 추천해주는 비둘기.', '/sprites/characters/mailbird-pigeon.png', 480, 'common'),
(gen_random_uuid(), '음악가 개구리', '동시를 읽으며 리듬을 만드는 개구리.', '/sprites/characters/musician-frog.png', 510, 'common'),
(gen_random_uuid(), '정원사 두더지', '이야기의 씨앗을 심어 꽃을 피우는 두더지.', '/sprites/characters/gardener-mole.png', 540, 'common'),
(gen_random_uuid(), '수학자 개미', '책의 페이지 수를 정확히 세는 똑똑한 개미.', '/sprites/characters/math-ant.png', 570, 'common'),
(gen_random_uuid(), '발명가 쥐', '책에서 읽은 아이디어로 발명품을 만드는 쥐.', '/sprites/characters/inventor-mouse.png', 600, 'common'),
(gen_random_uuid(), '서핑 수달', '파도 위에서도 책을 놓지 않는 수달.', '/sprites/characters/surfing-otter.png', 640, 'common'),
(gen_random_uuid(), '사진사 미어캣', '인상 깊은 장면을 마음 카메라로 찍는 미어캣.', '/sprites/characters/photographer-meerkat.png', 680, 'common'),
(gen_random_uuid(), '철학자 올빼미', '밤새 생각에 잠기는 사색하는 올빼미.', '/sprites/characters/philosopher-owl.png', 720, 'common'),
(gen_random_uuid(), '조각가 비버', '나무로 책 속 장면을 조각하는 예술가 비버.', '/sprites/characters/sculptor-beaver.png', 760, 'common'),
(gen_random_uuid(), '천문학자 부엉이', '별자리 도감을 외우고 있는 지식인 부엉이.', '/sprites/characters/astronomer-owl.png', 800, 'common'),
(gen_random_uuid(), '마라톤 치타', '속독의 달인! 빠르게 읽고 정확히 이해하는 치타.', '/sprites/characters/marathon-cheetah.png', 850, 'common'),

-- RARE characters (900cm – 4500cm)
(gen_random_uuid(), '지혜 부엉이', '천 년의 지혜를 품은 현명한 부엉이 학자.', '/sprites/characters/wise-owl.png', 900, 'rare'),
(gen_random_uuid(), '마법 여우', '책에서 읽은 주문을 실제로 쓸 수 있는 신비한 여우.', '/sprites/characters/magic-fox.png', 1000, 'rare'),
(gen_random_uuid(), '탐험 펭귄', '남극에서 온 여행기 전문가 펭귄.', '/sprites/characters/explorer-penguin.png', 1100, 'rare'),
(gen_random_uuid(), '바다 해마', '심해 도서관을 지키는 수중 사서 해마.', '/sprites/characters/sea-seahorse.png', 1200, 'rare'),
(gen_random_uuid(), '번개 토끼', '한 시간에 책 한 권을 읽는 초고속 토끼.', '/sprites/characters/lightning-rabbit.png', 1300, 'rare'),
(gen_random_uuid(), '바람 매', '높은 하늘에서 세상의 이야기를 내려다보는 매.', '/sprites/characters/wind-hawk.png', 1400, 'rare'),
(gen_random_uuid(), '용 사서', '거대한 동굴 도서관을 지키는 용의 사서.', '/sprites/characters/dragon-librarian.png', 1500, 'rare'),
(gen_random_uuid(), '달빛 늑대', '보름달 밤에 시를 읊는 낭만적인 늑대.', '/sprites/characters/moonlight-wolf.png', 1600, 'rare'),
(gen_random_uuid(), '수정 사슴', '뿔에 지식의 결정이 자라는 신성한 사슴.', '/sprites/characters/crystal-deer.png', 1700, 'rare'),
(gen_random_uuid(), '무지개 뱀', '비가 온 뒤 나타나는 일곱 빛깔 지식의 뱀.', '/sprites/characters/rainbow-snake.png', 1800, 'rare'),
(gen_random_uuid(), '시간 두루미', '옛이야기와 전설을 기억하는 장수 두루미.', '/sprites/characters/time-crane.png', 1900, 'rare'),
(gen_random_uuid(), '꽃잎 나비', '시집을 읽으면 날개에 새로운 무늬가 피어나는 나비.', '/sprites/characters/petal-butterfly.png', 2000, 'rare'),
(gen_random_uuid(), '별자리 고래', '바다 위로 별의 이야기를 뿜어내는 신비한 고래.', '/sprites/characters/constellation-whale.png', 2200, 'rare'),
(gen_random_uuid(), '안개 기린', '구름 위 도서관에 닿을 수 있는 긴 목의 기린.', '/sprites/characters/mist-giraffe.png', 2400, 'rare'),
(gen_random_uuid(), '화산 도롱뇽', '열정이 넘쳐 몸에서 불꽃이 튀는 독서가.', '/sprites/characters/volcano-salamander.png', 2600, 'rare'),
(gen_random_uuid(), '눈꽃 북극곰', '겨울 이야기를 읽으면 눈을 내리게 하는 곰.', '/sprites/characters/snowflake-polarbear.png', 2800, 'rare'),
(gen_random_uuid(), '황금 독수리', '지식의 봉우리에서 세상을 바라보는 독수리.', '/sprites/characters/golden-eagle.png', 3000, 'rare'),
(gen_random_uuid(), '오로라 순록', '북극의 오로라 아래에서 동화를 읽는 순록.', '/sprites/characters/aurora-reindeer.png', 3500, 'rare'),
(gen_random_uuid(), '산호 거북', '바다 밑 도서관의 수천 년 된 현자 거북.', '/sprites/characters/coral-turtle.png', 4000, 'rare'),
(gen_random_uuid(), '은하 돌고래', '은하수를 헤엄치며 우주의 이야기를 전하는 돌고래.', '/sprites/characters/galaxy-dolphin.png', 4500, 'rare'),

-- EPIC characters (5000cm – 9000cm)
(gen_random_uuid(), '불사조 독서가', '재에서 되살아나 영원히 읽는 불사조. 지식은 불멸이다.', '/sprites/characters/phoenix-reader.png', 5000, 'epic'),
(gen_random_uuid(), '유니콘 시인', '뿔에서 영감의 빛이 나오는 전설의 시인 유니콘.', '/sprites/characters/unicorn-poet.png', 5500, 'epic'),
(gen_random_uuid(), '번개 그리핀', '하늘의 도서관을 지키는 반사자반독수리 수호자.', '/sprites/characters/lightning-griffin.png', 6000, 'epic'),
(gen_random_uuid(), '크리스탈 드래곤', '수정 비늘에 읽은 모든 책의 내용을 저장하는 드래곤.', '/sprites/characters/crystal-dragon.png', 6500, 'epic'),
(gen_random_uuid(), '오딘의 까마귀', '세상의 모든 지식을 모아 전하는 신화 속 까마귀.', '/sprites/characters/odin-raven.png', 7000, 'epic'),
(gen_random_uuid(), '심해 크라켄', '바다 가장 깊은 곳에서 금서를 지키는 전설의 크라켄.', '/sprites/characters/deep-kraken.png', 7500, 'epic'),
(gen_random_uuid(), '세계수 정령', '세계수에 깃든 모든 이야기의 수호 정령.', '/sprites/characters/world-tree-spirit.png', 8000, 'epic'),
(gen_random_uuid(), '시공간 스핑크스', '수수께끼로 시간을 다스리는 고대의 스핑크스.', '/sprites/characters/spacetime-sphinx.png', 9000, 'epic'),

-- LEGENDARY characters (10000cm+)
(gen_random_uuid(), '하늘 고래', '구름 바다를 헤엄치는 거대한 하늘 고래. 등 위에 도서관이 있다.', '/sprites/characters/sky-whale.png', 10000, 'legendary'),
(gen_random_uuid(), '별빛 독서가', '남산타워만큼 쌓은 책의 탑 위에서 별을 읽는 전설의 독서가.', '/sprites/characters/starlight-reader.png', 33300, 'legendary'),
(gen_random_uuid(), '시간의 현자', '롯데월드타워 높이의 지식을 지닌 시간을 초월한 현자.', '/sprites/characters/sage-of-time.png', 55500, 'legendary'),
(gen_random_uuid(), '우주 독서가', '1km 높이의 책탑 위에서 우주의 진리를 읽는 궁극의 독서가.', '/sprites/characters/cosmic-reader.png', 100000, 'legendary');
