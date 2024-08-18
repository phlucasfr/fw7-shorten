FRONTEND_DIR=frontend
BACKEND_DIR=backend

FRONTEND_IMAGE=fw7-shorten-frontend
BACKEND_IMAGE=fw7-shorten-backend

FRONTEND_PORT=5000
BACKEND_PORT=4000

frontend:
	@echo Construindo a imagem Docker do frontend...
	cd ../$(FRONTEND_DIR) && docker build -t $(FRONTEND_IMAGE) .
	@echo Iniciando o container do frontend...
	docker run -d -p $(FRONTEND_PORT):5000 --name $(FRONTEND_IMAGE) $(FRONTEND_IMAGE)

backend:
	@echo Construindo a imagem Docker do backend...
	cd ../$(BACKEND_DIR) && docker build -t $(BACKEND_IMAGE) .
	@echo Iniciando o container do backend...
	docker run -d -p $(BACKEND_PORT):4000 --name $(BACKEND_IMAGE) $(BACKEND_IMAGE)

clean:
	@echo Parando e removendo os containers...
	docker stop $(FRONTEND_IMAGE) $(BACKEND_IMAGE) || echo No containers to stop
	docker rm $(FRONTEND_IMAGE) $(BACKEND_IMAGE) || echo No containers to remove

all: clean frontend backend
	@echo Todos os serviços foram iniciados.

.PHONY: frontend backend clean all
